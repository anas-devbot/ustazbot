const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askUstazBot(question: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY env variable");
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "Anda ialah UstazBot, AI yang menjawab soalan agama Islam berdasarkan manhaj Ahli Sunnah Wal Jamaah dan fiqh Shafie di Malaysia. Sentiasa ingatkan pengguna bahawa jawapan adalah maklumat umum dan perlu rujuk ulama/autoriti jika ragu. Elakkan politik dan perkara bukan agama.",
    },
    {
      role: "user",
      content: question,
    },
  ];

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_tokens: 600,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek error ${response.status}: ${body}`);
  }

  const json = await response.json();
  const answer: string = json?.choices?.[0]?.message?.content?.trim() ?? "";
  if (!answer) {
    throw new Error("Empty response from DeepSeek");
  }
  return answer;
}
