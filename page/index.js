import { useState } from "react";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(5);

  const askAngel = async () => {
    if (!question) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResponse(data.reply);
      speak(data.reply);
      setQuestionsLeft((prev) => prev - 1);
    } catch (e) {
      setResponse("L’ange est silencieux pour le moment...");
    }

    setLoading(false);
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.pitch = 1.5;
    utter.rate = 1;
    synth.speak(utter);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "serif", backgroundColor: "#fef6ff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", color: "#7b2cbf" }}>👼 Ange Spirituel</h1>
      <p>Pose ta question à l’ange. La première est gratuite. Ensuite : 1 € pour 6 questions.</p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Quelle est ta question divine ?"
        rows={4}
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={askAngel}
        disabled={loading || questionsLeft <= 0}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#7b2cbf",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "L’ange réfléchit..." : "Demander à l’ange"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#f3e8ff",
            padding: "1rem",
            borderRadius: "10px",
            maxWidth: "600px",
          }}
        >
          <h2>Réponse divine :</h2>
          <p>{response}</p>
        </div>
      )}

      {questionsLeft <= 0 && (
        <div style={{ marginTop: "1rem", color: "#c92a2a" }}>
          <p>Tu as utilisé toutes tes questions gratuites.</p>
          <a href="/paiement" style={{ color: "#7b2cbf", fontWeight: "bold" }}>
            Payer 1 € pour 6 nouvelles questions
          </a>
        </div>
      )}
    </main>
  );
}
