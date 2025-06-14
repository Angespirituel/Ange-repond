import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAngel = async () => {
    setLoading(true);
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);

    // 🎤 Optionnel : faire parler la réponse
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(data.reply);
    utterance.pitch = 1.3;
    utterance.rate = 0.95;
    utterance.voice = synth.getVoices().find(v => v.name.includes("Google") || v.name.includes("Female")) || null;
    synth.speak(utterance);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>👼 Ange Spirituel</h1>
      <p>Pose ta question à l’ange :</p>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        placeholder="Écris ta question ici"
      />
      <button onClick={askAngel} disabled={loading}>
        {loading ? 'L’ange réfléchit...' : 'Demander à l’ange'}
      </button>
      {response && (
        <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <strong>Réponse :</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
