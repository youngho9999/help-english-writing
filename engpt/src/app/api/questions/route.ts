import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryOffset = parseInt(searchParams.get("offset") || "0");
    const limit = 10;

    // queryOffset이 0이면 40~120 사이의 랜덤 정수 생성
    const offset =
      queryOffset === 0 ? Math.floor(Math.random() * (120 - 40 + 1)) + 40 : queryOffset;
    // offset 이후의 문장들 가져오기
    const sentences = await prisma.sentences.findMany({
      where: {
        korean_sentence: { not: null },
        sentence_id: { gt: offset },
      },
      take: limit,
    });

    // 필요한 데이터만 변환
    const questions = sentences.map((s) => ({
      id: s.sentence_id,
      korean: s.korean_sentence!,
      english: s.english_sentence,
    }));

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Questions fetch error:", error);
    return NextResponse.json({ error: "문제를 가져오는 중 오류가 발생했습니다." }, { status: 500 });
  }
}
