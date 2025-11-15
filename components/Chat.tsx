"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant" | "system";

interface Message {
  id: string;
  role: Role;
  content: string;
}

const initialMessages: Message[] = [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "Hi! I?m your personal agent. Try: /help, /calc 2+2*3, /search next.js app dir, /fetch https://example.com",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const canSend = useMemo(() => input.trim().length > 0 && !busy, [input, busy]);

  async function send() {
    if (!canSend) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      const assistant: Message = { id: crypto.randomUUID(), role: "assistant", content: data.reply ?? "(no response)" };
      setMessages((m) => [...m, assistant]);
    } catch (err) {
      const assistant: Message = { id: crypto.randomUUID(), role: "assistant", content: "Error: " + (err as Error).message };
      setMessages((m) => [...m, assistant]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: 12, height: 'calc(100vh - 140px)' }}>
      <div ref={listRef} style={{ overflowY: 'auto', border: '1px solid #1f2a44', borderRadius: 12, padding: 16, background: '#0e1430' }}>
        {messages.map((m) => (
          <div key={m.id} style={{
            background: m.role === 'user' ? '#13234b' : '#101a3a',
            border: '1px solid #1f2a44',
            padding: 12,
            borderRadius: 10,
            marginBottom: 10
          }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{m.role}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={busy ? "Working..." : "Type a message or a /command"}
          style={{
            flex: 1,
            background: '#0e1430',
            color: '#e6eaf2',
            border: '1px solid #1f2a44',
            borderRadius: 10,
            padding: '12px 14px',
            outline: 'none'
          }}
        />
        <button onClick={send} disabled={!canSend} style={{
          background: canSend ? '#2563eb' : '#1e293b',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '12px 16px',
          cursor: canSend ? 'pointer' : 'not-allowed'
        }}>Send</button>
      </div>
    </div>
  );
}
