"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { FaFacebookSquare, FaWhatsappSquare, FaTiktok } from "react-icons/fa";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/syahnas/",
    icon: <FaFacebookSquare className="h-5 w-5" />, 
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/60192323043?text=Assalamualaikum%20Nak%20tanya%20berkenaan%20UstazBot",
    icon: <FaWhatsappSquare className="h-5 w-5" />, 
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@pakcikbuku.com",
    icon: <FaTiktok className="h-5 w-5" />, 
  },
];

const steps = [
  "Tanya soalan dengan jelas dan lengkap (fiqh Shafie, aqidah, ibadah).",
  "Klik Hantar dan tunggu AI menjana jawapan.",
  "Jika ragu, rujuk guru bertauliah – jawapan AI ialah panduan umum.",
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) {
      setError("Sila tulis soalan terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Ralat tidak diketahui");
      }
      setAnswer(data.answer);
      setQuestion("");
    } catch (err) {
      setError((err as Error).message ?? "Sistem sedang sibuk. Cuba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F1] text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/UstazBot-Site-Logo-2.png"
            alt="UstazBot"
            width={280}
            height={80}
            priority
          />
          <p className="text-lg font-semibold text-slate-600">
            Al Islamik – anda tanya AI Jawab
          </p>
          <p className="text-sm text-emerald-700">
            السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
          </p>
        </header>

        <main className="mt-10 grid gap-10 lg:grid-cols-[3fr,2fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800">
              Apa itu UstazBot?
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              UstazBot ialah AI yang membantu menjawab persoalan agama Islam
              berdasarkan fiqh mazhab Shafie di Malaysia. Ia hanyalah alat bantu
              dan <strong>TIDAK</strong> menggantikan pandangan ulama. Sila belajar
              daripada guru yang benar dan rujuk pihak berautoriti jika ada
              keraguan.
            </p>

            <ul className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
              {steps.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Tulis soalan anda di sini. Pastikan lengkap dan tidak tergantung..."
                className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-inner focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Sedang menjawab..." : "Hantar"}
              </button>
            </form>

            {error && (
              <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}

            {answer && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Jawapan AI
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {answer}
                </p>
                <p className="mt-4 text-xs text-amber-600">
                  Jawapan adalah maklumat umum. Sila rujuk ulama bertauliah jika
                  terdapat keraguan.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
              <Image
                src="/images/UstazBot-Site-Logo-3.png"
                alt="Logo kecil"
                width={180}
                height={60}
              />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Terima kasih kerana menggunakan UstazBot! Klik butang di bawah
                untuk follow PakcikBuku @ Syahnas atau hubungi terus melalui
                WhatsApp.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900/80 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-900"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm text-slate-600">
              <h3 className="text-base font-semibold text-slate-800">
                Penafian
              </h3>
              <p>
                Jawapan AI berdasarkan maklumat yang tersedia dan tidak
                menggantikan pandangan ulama. Untuk isu kritikal, mohon rujuk
                pihak berautoriti.
              </p>
              <p>
                UstazBot tidak menyimpan sejarah perbualan. Setiap soalan dianggap
                baharu dan bebas data peribadi.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-5 text-sm text-slate-600">
              <h3 className="text-base font-semibold text-slate-800">
                Hubungi pembangun
              </h3>
              <p className="mt-2">
                Dibangunkan oleh PakcikBuku @ Syahnas. Sebarang isu tentang AI
                UstazBot boleh dihantar melalui WhatsApp.
              </p>
              <Link
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50"
                href="https://wa.me/60192323043?text=Assalamualaikum%20Nak%20tanya%20berkenaan%20UstazBot"
                target="_blank"
              >
                WhatsApp Support
              </Link>
            </div>
          </aside>
        </main>

        <footer className="mt-12 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          <Image
            src="/images/UstazBot-Site-Logo-2.png"
            alt="UstazBot"
            width={160}
            height={45}
          />
          <p>AI Islamik – anda tanya AI Jawab</p>
          <p>© {new Date().getFullYear()} UstazBot. Dibina dengan kasih sayang.</p>
        </footer>
      </div>
    </div>
  );
}
