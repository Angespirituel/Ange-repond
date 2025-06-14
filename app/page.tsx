// app/page.tsx (ou pages/index.tsx si Next.js 12)

"use client";

import { useState } from "react";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(5); // après la 1re gratuite

  const askAngel = async () => {
    if (!question) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResponse(data.reply);
      speakResponse(data.reply);
      setQuestionsLeft((prev) => prev - 1);
    } catch (e) {
      setResponse("L'ange est silencieux pour l’instant...");
    }
    setLoading(false);
  };

  const speakResponse = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.pitch = 1.5;
    utter.rate = 1;
    utter.voice = synth.getVoices().find(v => v.lang === "fr-FR" && v.name.includes("Google") || true);
    synth.speak(utter);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-200 to-white p-6">
      <h1 className="text-3xl font-bold mb-4">👼 Ange Spirituel</h1>
      <p className="mb-2 text-center text-lg text-gray-700">
        Pose ta question à l’ange. La première est gratuite, puis 1 € pour 6.
      </p>
      <textarea
        placeholder="Écris ta question ici..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full max-w-md h-24 p-3 border border-gray-300 rounded-lg shadow-sm"
      />
      <button
        onClick={askAngel}
        disabled={loading || (questionsLeft <= 0)}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "L’ange répond..." : "Demander à l’ange"}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-white border border-gray-300 rounded shadow w-full max-w-md">
          <h2 className="font-semibold mb-2">Réponse divine :</h2>
          <p className="text-gray-800 whitespace-pre-line">{response}</p>
        </div>
      )}

      {questionsLeft <= 0 && (
        <div className="mt-6 text-center">
          <p className="text-red-600 font-semibold">Tu as utilisé toutes tes questions gratuites.</p>
          <a
            href="/paiement"
            className="mt-2 inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Payer 1 € pour 6 nouvelles questions
          </a>
        </div>
      )}
    </main>
  );
}
