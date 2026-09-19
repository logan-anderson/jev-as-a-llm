import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import { CORPUS, type CategoryName } from "./corpus.js";

export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (role === "user" || role === "assistant") && typeof content === "string";
}

const MAX_REPLY_LENGTH = 100;

// Common conversational words Jev can choose from ("stop" is left out since it's a label).
const WORDS = [
  // pronouns and people
  "I", "me", "my", "you", "your", "we", "us", "our", "they", "them", "it", "its",
  "he", "she", "people", "friend",
  // greetings and reactions
  "hello", "hi", "hey", "thanks", "thank", "please", "sorry", "yes", "no", "okay",
  "sure", "great", "good", "nice", "cool", "welcome", "bye", "wow",
  // verbs
  "am", "is", "are", "was", "be", "been", "do", "does", "did", "have", "has", "had",
  "can", "could", "will", "would", "should", "might", "must", "go", "get", "make",
  "know", "think", "want", "need", "like", "love", "help", "see", "look", "say",
  "tell", "ask", "try", "use", "find", "give", "take", "work", "feel", "mean",
  "talk", "chat", "learn", "hope", "doing", "going",
  // question and connecting words
  "what", "why", "how", "when", "where", "who", "which", "and", "or", "but", "so",
  "because", "if", "then", "that", "this", "these", "those", "there", "here",
  // articles and prepositions
  "a", "an", "the", "to", "of", "in", "on", "at", "for", "with", "about", "from",
  "by", "up", "out", "into", "over", "after", "before",
  // adverbs and quantifiers
  "not", "very", "really", "just", "too", "also", "now", "today", "again", "still",
  "always", "never", "maybe", "all", "some", "any", "more", "much", "many", "lot",
  "little", "every", "one", "two",
  // nouns and adjectives
  "day", "time", "way", "thing", "things", "question", "idea", "problem", "answer",
  "name", "life", "world", "fun", "new", "happy", "bad", "right", "well", "better",
  "best", "sounds", "glad",
];

// Appends a word to the reply, with a space between words.
const withWord = (reply: string, word: string) => (reply ? `${reply} ${word}` : word);

// One option per word, each described by the full reply it would produce,
// so Jev compares whole candidate replies.
const wordOptions = (reply: string, words: readonly string[]) =>
  Object.fromEntries(words.map((w) => [w, JSON.stringify(withWord(reply, w))]));

const stopOption = (reply: string) =>
  `${JSON.stringify(reply)} (finished; send this as the final reply)`;

const WORD_QUESTION =
  "Which candidate is the best reply to this conversation so far? Pick stop only if the reply is complete.";

// Created lazily so the server can boot (and report a clear error) without TYPESAFE_API_KEY.
let client: TypeSafeClient | undefined;
const getClient = () => (client ??= new TypeSafeClient());

// A type alias (not an interface) so it's assignable to the SDK's JSON state type.
type ReplyState = {
  conversation: { role: Role; content: string }[];
  reply: string;
};

// Picks the next step of the reply and returns the whole new reply, or undefined to stop.
type PickNext = (state: ReplyState) => Promise<string | undefined>;

// Letters: one Jev call per character, choosing from a-z, space or stop.
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

// Bare letter labels (not whole candidate replies): with full replies as options,
// Jev prefers any complete word ("a") over a half-typed one and stops immediately.
const pickLetter: PickNext = async (state) => {
  const reply = state.reply;
  // Space and stop only make sense after some text, and never twice in a row,
  // otherwise Jev gets stuck choosing space forever.
  const canBreak = reply !== "" && !reply.endsWith(" ");
  console.log('jev state', JSON.stringify(state, null, 2));
  const { answers } = await getClient().systemOne({
    state,
    questions: {
      pickLetter: choice(
        "Next letter in response to this conversation, your choice will be appended",
        {
          ...Object.fromEntries(LETTERS.map((l) => [l, null])),
          ...(canBreak && {
            space: "A space character between words",
            stop: "The reply is complete; send it to the user",
          }),
        },
      ),
    },
  });
  console.log('jev results', JSON.stringify(answers, null, 2));
  const next = answers.pickLetter.choice;
  if (next === "stop") return undefined;
  return reply + (next === "space" ? " " : next);
};

// Small vocabulary: one Jev call per word, choosing from every word at once.
const pickFromWords: PickNext = async (state) => {
  const reply = state.reply;
  const { answers } = await getClient().systemOne({
    state,
    questions: {
      next: choice(WORD_QUESTION, { ...wordOptions(reply, WORDS), stop: stopOption(reply) }),
    },
  });
  return answers.next.choice === "stop" ? undefined : withWord(reply, answers.next.choice);
};

// Large vocabulary: two Jev calls per word so neither sees the whole corpus.
// First Jev picks a category (or stop), then a word from that category.
const pickFromCorpus: PickNext = async (state) => {
  const reply = state.reply;
  const categories = Object.fromEntries(
    Object.entries(CORPUS).map(([name, { description }]) => [name, description]),
  );
  const { answers: step1 } = await getClient().systemOne({
    state,
    questions: {
      category: choice(
        "What kind of word should come next in the assistant's reply? Pick stop only if the reply is complete.",
        { ...categories, stop: stopOption(reply) },
      ),
    },
  });
  if (step1.category.choice === "stop") return undefined;

  const { words } = CORPUS[step1.category.choice as CategoryName];
  const { answers: step2 } = await getClient().systemOne({
    state,
    questions: { word: choice(WORD_QUESTION, wordOptions(reply, words)) },
  });
  return withWord(reply, step2.word.choice);
};

// Produces the agent's next message step by step: Jev picks what comes next,
// and the result is fed back in until Jev stops or the reply hits the cap.
async function buildReply(messages: ChatMessage[], pickNext: PickNext): Promise<ChatMessage> {
  const conversation = messages.map((m) => ({ role: m.role, content: m.content }));
  let reply = "";

  while (reply.length < MAX_REPLY_LENGTH) {
    const next = await pickNext({ conversation, reply });
    if (next === undefined) break;
    reply = next;
    console.log('reply so far:', reply);
  }

  return { role: "assistant", content: reply };
}

export const nextAgentMessageLetters = (messages: ChatMessage[]) =>
  buildReply(messages, pickLetter);

export const nextAgentMessage = (messages: ChatMessage[]) => buildReply(messages, pickFromWords);

export const nextAgentMessageLarge = (messages: ChatMessage[]) =>
  buildReply(messages, pickFromCorpus);
