import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ChatMessage } from '../../server/src/chat'
import { api } from './api'
import './App.css'

type Vocab = 'letters' | 'small' | 'large'

const VOCABS: { id: Vocab; label: string; hint: string }[] = [
  { id: 'letters', label: 'Letters', hint: 'a-z and space, 1 Jev call per character' },
  { id: 'small', label: 'Small', hint: '~170 words, 1 Jev call per word' },
  { id: 'large', label: 'Large', hint: '~1,600 words in categories, 2 Jev calls per word' },
]

// Which vocabulary produced each assistant message, keyed by message index.
type VocabByIndex = Record<number, Vocab>

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [vocab, setVocab] = useState<Vocab>('small')
  const [vocabByIndex, setVocabByIndex] = useState<VocabByIndex>({})
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pending])

  async function send(e: FormEvent) {
    e.preventDefault()
    const content = input.trim()
    if (!content || pending) return

    const next: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setPending(true)
    setError(null)

    try {
      const endpoint = { letters: api.chat.letters, small: api.chat, large: api.chat.large }[vocab]
      const res = await endpoint.$post({ json: { messages: next } })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setMessages([...next, data.message])
      setVocabByIndex((prev) => ({ ...prev, [next.length]: vocab }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="chat">
      <header className="chat-header">
        <span>jev-as-a-llm</span>
        <div className="vocab-toggle" role="radiogroup" aria-label="Vocabulary">
          {VOCABS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={vocab === v.id}
              title={v.hint}
              className={vocab === v.id ? 'active' : ''}
              disabled={pending}
              onClick={() => setVocab(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </header>

      <main className="chat-log">
        {messages.length === 0 && (
          <p className="chat-empty">Say something to start the conversation.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
            {vocabByIndex[i] && <span className="bubble-tag">{vocabByIndex[i]}</span>}
          </div>
        ))}
        {pending && <div className="bubble assistant typing">…</div>}
        {error && <p className="chat-error">{error}</p>}
        <div ref={bottomRef} />
      </main>

      <form className="chat-input" onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          autoFocus
        />
        <button type="submit" disabled={pending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default App
