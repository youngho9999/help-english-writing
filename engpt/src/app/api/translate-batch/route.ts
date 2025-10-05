import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { translateBatch } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { sentenceIds } = await request.json();

    if (!sentenceIds || !Array.isArray(sentenceIds) || sentenceIds.length === 0) {
      return NextResponse.json({ error: "유효한 sentenceIds가 필요합니다." }, { status: 400 });
    }

    if (sentenceIds.length > 10) {
      return NextResponse.json(
        { error: "한 번에 최대 10개까지만 번역 가능합니다." },
        { status: 400 }
      );
    }

    // 문장 조회
    const sentences = await prisma.sentences.findMany({
      where: {
        sentence_id: { in: sentenceIds },
      },
    });

    if (sentences.length === 0) {
      return NextResponse.json({ error: "문장을 찾을 수 없습니다." }, { status: 404 });
    }

    // 번역 진행
    const toTranslate = sentences.map((s) => ({
      id: s.sentence_id,
      english: s.english_sentence,
    }));

    const translations = await translateBatch(toTranslate);

    // DB 업데이트 및 결과 수집
    const results = await Promise.all(
      translations.map(async (translation) => {
        const sentence = sentences.find((s) => s.sentence_id === translation.id);

        if (!sentence) {
          return {
            sentence_id: translation.id,
            english_sentence: "",
            korean_sentence: "",
            status: "error" as const,
            error: "문장을 찾을 수 없습니다.",
          };
        }

        if (translation.error) {
          return {
            sentence_id: translation.id,
            english_sentence: sentence.english_sentence,
            korean_sentence: "",
            status: "error" as const,
            error: translation.error,
          };
        }

        // DB 업데이트
        try {
          await prisma.sentences.update({
            where: { sentence_id: translation.id },
            data: { korean_sentence: translation.korean },
          });

          return {
            sentence_id: translation.id,
            english_sentence: sentence.english_sentence,
            korean_sentence: translation.korean,
            status: "success" as const,
          };
        } catch (dbError) {
          return {
            sentence_id: translation.id,
            english_sentence: sentence.english_sentence,
            korean_sentence: translation.korean,
            status: "error" as const,
            error: "DB 업데이트 실패",
          };
        }
      })
    );

    const successCount = results.filter((r) => r.status === "success").length;
    const failedCount = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      results,
    });
  } catch (error) {
    console.error("Batch translation error:", error);
    return NextResponse.json({ error: "번역 중 오류가 발생했습니다." }, { status: 500 });
  }
}
