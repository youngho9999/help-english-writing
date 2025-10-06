import { NextRequest, NextResponse } from "next/server";
import generateContent from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { korean, english, userAnswer } = await request.json();

    if (!korean || !english || !userAnswer) {
      return NextResponse.json(
        { error: "한글 문장, 영어 문장, 사용자 답변이 필요합니다." },
        { status: 400 }
      );
    }

    const responseText = await generateContent(korean, english, userAnswer);

    return NextResponse.json(responseText);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "평가 중 오류가 발생했습니다." }, { status: 500 });
  }
}
