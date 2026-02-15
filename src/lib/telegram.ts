interface TelegramLogPayload {
  question: string;
  answer?: string;
  error?: string;
}

export async function sendTelegramLog(payload: TelegramLogPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram env vars not configured");
    return;
  }

  const { question, answer, error } = payload;
  const timestamp = new Intl.DateTimeFormat("ms-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date());

  const normalize = (text?: string) =>
    (text ?? "").replace(/\s+/g, (match) => (match.includes("\n") ? "\n" : " ")).trim();

  const lines = [
    `UstazBot Log (${timestamp})`,
    `Soalan:\n${normalize(question) || "-"}`,
  ];

  if (error) {
    lines.push("Status: GAGAL", `Error:\n${normalize(error) || "Unknown"}`);
  } else {
    lines.push("Status: BERJAYA", `Jawapan:\n${normalize(answer) || "-"}`);
  }

  const message = lines.join("\n\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("Failed to send Telegram log", err);
  }
}
