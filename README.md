# UstazBot Web (Next.js)

Landing + Q&A interface untuk UstazBot. Dibina dengan Next.js (App Router), Tailwind CSS dan API routes untuk:

- Menjana jawapan menggunakan DeepSeek (`/api/ask`)
- Log setiap soal jawab ke Telegram
- Papar CTA sosial, disclaimer, dan pautan WhatsApp support

## Struktur
```
ustazbot-site/
├─ public/images/                 # Logo UstazBot
├─ src/app/
│  ├─ page.tsx                    # UI utama (hero, borang, CTA)
│  └─ api/ask/route.ts            # Endpoint DeepSeek + log Telegram
├─ src/lib/
│  ├─ ai.ts                       # Helper call DeepSeek
│  └─ telegram.ts                 # Helper log ke Telegram
└─ .env.example                   # Template env vars
```

## Menjalankan secara lokal
```bash
cp .env.example .env.local   # isikan key sebenar
npm install
npm run dev
```
Kepilkan nilai berikut dalam `.env.local`:
- `DEEPSEEK_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Deploy
1. Push repo ke GitHub.
2. Cipta projek Vercel (import repo, set env vars sama seperti di atas).
3. Point domain `ustazbot.com` ke Vercel bila sedia.

## Catatan
- Komponen borang akan memanggil `/api/ask` dan memaparkan jawapan serta menolak log ke Telegram secara automatik.
- Semua ikon sosial menggunakan `react-icons` (Facebook, WhatsApp, TikTok).
- Layout mengekalkan gaya minimal seperti versi Hostinger asal.
