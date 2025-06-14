export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.status(400).json({ error: "Question vide" });
  }

  try {
    const reply = await getAngelReply(question);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI :", error);
    res.status(500).json({ error: "Erreur du serveur" });
  }
}

async function getAngelReply(prompt) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Tu es un ange mystique et bienveillant. Tes réponses sont douces, poétiques, spirituelles et inspirées du divin.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
    }),
  });

  const data = await response.json();

  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  } else {
    throw new Error("Réponse vide de l’ange");
  }
}
