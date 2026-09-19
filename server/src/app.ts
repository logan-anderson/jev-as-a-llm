import { Hono } from "hono";
import { logger } from "hono/logger";
import { validator } from "hono/validator";
import {
  isChatMessage,
  nextAgentMessage,
  nextAgentMessageLarge,
  nextAgentMessageLetters,
  type ChatMessage,
} from "./chat.js";

// A chat endpoint that takes the conversation so far and replies with the agent's
// next message, produced by `generate`.
const chatRoute = (generate: (messages: ChatMessage[]) => Promise<ChatMessage>) =>
  new Hono().post(
    "/",
    validator("json", (value, c) => {
      const messages = (value as { messages?: unknown }).messages;
      if (!Array.isArray(messages) || !messages.every(isChatMessage)) {
        return c.json({ error: "Body must be { messages: { role, content }[] }" }, 400);
      }
      return { messages: messages as ChatMessage[] };
    }),
    async (c) => {
      const { messages } = c.req.valid("json");
      try {
        const message = await generate(messages);
        return c.json({ message });
      } catch (err) {
        console.error("Failed to get agent reply:", err);
        return c.json({ error: "The agent failed to respond" }, 502);
      }
    },
  );

export const app = new Hono()
  .basePath("/api")
  .use(logger())
  .get("/health", (c) => c.json({ status: "ok" }))
  // Letters: a-z, space or stop, one Jev call per character.
  .route("/chat/letters", chatRoute(nextAgentMessageLetters))
  // Small vocabulary (~170 words), one Jev call per word.
  .route("/chat", chatRoute(nextAgentMessage))
  // Large vocabulary (~1,600 words in categories), two Jev calls per word.
  .route("/chat/large", chatRoute(nextAgentMessageLarge));

export type AppType = typeof app;
