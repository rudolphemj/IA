
import { useState } from 'react';

export default function Home() {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');

  async function send() {
    const r = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    });
    const d = await r.json();
    setA(d.answer);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Assistant IA (Groq)</h1>
      <textarea rows={4} value={q} onChange={e => setQ(e.target.value)} />
      <br /><br />
      <button onClick={send}>Envoyer</button>
      <pre>{a}</pre>
    </main>
  );
}
