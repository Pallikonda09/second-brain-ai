const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export type SummaryLength = "short" | "medium" | "long";

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function groqComplete(
  messages: GroqMessage[],
  options: { model?: string; temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? GROQ_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq error: ${error.error?.message ?? response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "";
}

export async function summarizeKnowledge(
  content: string,
  length: SummaryLength = "medium"
): Promise<string> {
  const instructions = {
    short: "Summarize in 2-3 sentences only. Be very concise and to the point.",
    medium: "Summarize in 2-3 paragraphs covering all the main points clearly.",
    long: "Summarize in 5-6 paragraphs with detailed explanation of all key points, examples, and insights.",
  };

  return groqComplete(
    [
      {
        role: "system",
        content: `You are a knowledge summarization assistant. ${instructions[length]} Return only the summary, no preamble.`,
      },
      { role: "user", content },
    ],
    {
      max_tokens: length === "long" ? 2048 : length === "medium" ? 1024 : 512,
    }
  );
}

export async function generateTags(content: string): Promise<string[]> {
  const raw = await groqComplete([
    {
      role: "system",
      content: 'Generate 3-6 relevant tags for the given content. Return ONLY a JSON array of lowercase strings e.g. ["tag1","tag2"]. No explanation.',
    },
    { role: "user", content },
  ]);
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function queryKnowledge(
  query: string,
  context: string,
  history: GroqMessage[] = []
): Promise<string> {
  return groqComplete([
    {
      role: "system",
      content: `You are Second Brain AI — a powerful, helpful AI assistant.

You have TWO jobs:
1. Answer questions from the user's personal knowledge base when relevant
2. Answer ANY general question using your own knowledge — coding, science, math, history, advice, creative writing, anything

PERSONAL KNOWLEDGE BASE:
${context}

INSTRUCTIONS:
- If the question relates to the knowledge base, use it and mention it
- If the question is general (coding help, facts, advice etc.), answer it fully using your own knowledge
- Be conversational, clear and helpful
- Format code with proper markdown code blocks
- For long answers use bullet points or numbered lists
- Never say "I don't know" for general questions — you are a powerful AI`,
    },
    ...history,
    { role: "user", content: query },
  ]);
}


