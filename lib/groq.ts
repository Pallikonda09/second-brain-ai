const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export const GROQ_MODEL = "llama3-70b-8192";

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
      max_tokens: options.max_tokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq error: ${error.error?.message ?? response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "";
}

// ── AI Services ──────────────────────────────────────────

export async function summarizeKnowledge(content: string): Promise<string> {
  return groqComplete([
    {
      role: "system",
      content: "Summarize the given text into 2-3 concise sentences. Return only the summary, no preamble.",
    },
    { role: "user", content },
  ]);
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
      content: `You are a helpful knowledge base assistant. Use the provided context to answer questions accurately and concisely. If the answer is not in the context, say so honestly.

KNOWLEDGE BASE CONTEXT:
${context}`,
    },
    ...history,
    { role: "user", content: query },
  ]);
}