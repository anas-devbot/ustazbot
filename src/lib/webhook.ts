interface LogPayload {
  question: string;
  answer?: string;
  error?: string;
}

export async function sendLogToMake(payload: LogPayload) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("MAKE webhook env var not configured");
    return;
  }

  const { question, answer, error } = payload;
  const timestamp = new Date().toISOString();

  const normalize = (text?: string) =>
    (text ?? "")
      .replace(/\s+/g, (match) => (match.includes("\n") ? "\n" : " "))
      .trim();

  const body = {
    timestamp,
    status: error ? "FAILED" : "SUCCESS",
    question: normalize(question) || null,
    answer: error ? undefined : normalize(answer) || null,
    error: error ? normalize(error) || null : undefined,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Failed to send Make.com log", err);
  }
}
