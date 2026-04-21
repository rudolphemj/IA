
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });

  const { question } = req.body;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: question }]
  });

  res.json({ answer: response.choices[0].message.content });
}
