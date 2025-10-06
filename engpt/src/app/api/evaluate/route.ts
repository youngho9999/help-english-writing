import { NextRequest, NextResponse } from "next/server";
import generateContent from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { korean, english, userAnswer, sentenceId } = await request.json();

    if (!korean || !english || !userAnswer) {
      return NextResponse.json(
        { error: "한글 문장, 영어 문장, 사용자 답변이 필요합니다." },
        { status: 400 }
      );
    }

    // LLM 평가 실행
    const responseText = await generateContent(korean, english, userAnswer);

    // 제출 기록 저장 (로그인 여부와 관계없이 모두 저장)
    if (sentenceId) {
      try {
        const user = authenticate(request);
        const userId = user ? user.userId : null;

        // Raw query로 직접 삽입 (Prisma optional relation 이슈 우회)
        await prisma.$executeRaw`
          INSERT INTO submissions (
            id, "userId", "sentenceId", "userAnswer", korean, score, 
            "correctedSentence", "feedbackSummary", "detailedFeedback", 
            "createdAt", "updatedAt"
          ) VALUES (
            gen_random_uuid()::text,
            ${userId},
            ${sentenceId},
            ${userAnswer},
            ${korean},
            ${responseText.score},
            ${responseText.corrected_sentence},
            ${responseText.feedback_summary},
            ${JSON.stringify(responseText.detailed_feedback)}::jsonb,
            NOW(),
            NOW()
          )
        `;
      } catch (dbError) {
        // 저장 실패해도 평가 결과는 반환
        console.error("Failed to save submission:", dbError);
      }
    }

    return NextResponse.json(responseText);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "평가 중 오류가 발생했습니다." }, { status: 500 });
  }
}
