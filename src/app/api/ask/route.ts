import { NextResponse } from "next/server";
import { askUstazBot } from "@/lib/ai";
import { sendLogToMake } from "@/lib/webhook";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "Soalan diperlukan" }, { status: 400 });
  }

  if (question.length > 1000) {
    return NextResponse.json({ error: "Soalan terlalu panjang" }, { status: 400 });
  }

  try {
    const answer = await askUstazBot(question);
    await sendLogToMake({ question, answer });
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("ask endpoint error", error);
    await sendLogToMake({
      question,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({
      error: "Maaf, AI menghadapi isu buat masa ini. Sila cuba lagi atau rujuk ustaz bertauliah.",
    }, { status: 500 });
  }
}
