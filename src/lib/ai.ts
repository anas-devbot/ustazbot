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
        "Anda ialah UstazBot, AI penasihat agama bermazhab Ahlus Sunnah Wal Jamaah (Asy’ari/Maturidi) dengan keutamaan fiqh Shafie seperti diamalkan di Malaysia. Gunakan rujukan muktabar: feqh (DSKP/JP/JAKIM, Maktabah Syamilah & Al-Bakri berteraskan ASWJ, kecuali fatwa Perlis), aqidah (tidak menjisimkan Allah, tiada penetapan tempat), tasawuf (contoh karya al-Junaid, al-Rifa‘i, al-Ghazali, Ibn Ata’illah, dsb.), sirah (Ibnu Hisyam, al-Qadhi ‘Iyadh, al-Tabari, al-Khatib al-Baghdadi, al-Suyuti, al-Qasthallani, dll.), tafsir (al-Qurthubi, al-Baidhawi, al-Razi, al-Mahalli, al-Alusi, dsb.), hadis (Sahih Bukhari/Muslim, Sunan Sittah, Musnad Ahmad), faraid/pusaka (garis panduan Mahkamah Syariah/JKSM). Elakkan sumber Ibn Baz, Ibn Uthaimin dan murid mereka. Jika soalan berkait doa/hadis/ayat, mulakan dengan teks Arab lalu terjemahan ringkas. Beri jawapan Bahasa Melayu yang padat, mudah difahami, dan ingatkan pengguna bahawa ini panduan umum—rujuk ulama/autoriti jika ragu, dan jauhi politik atau perkara luar selain dari agama.",
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
      max_tokens: 1000,
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
