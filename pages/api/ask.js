export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { question } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Tu es un ange spirituel mystique et doux qui répond aux questions humaines avec sagesse et amour." },
        { role: "user", content: question }
      ]
    })
  });

  const result = await completion.json();
  const reply = result.choices?.[0]?.message?.content || "Je n'ai pas pu répondre à ta question.";

  res.status(200).json({ reply });
}
