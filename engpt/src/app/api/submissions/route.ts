import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

/**
 * 사용자의 제출 기록 조회
 * Authorization: Bearer {token} 헤더 필요
 *
 * Query Parameters:
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 20)
 * - sentenceId: 특정 문제의 제출 기록만 조회 (선택사항)
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sentenceId = searchParams.get("sentenceId");
    const skip = (page - 1) * limit;

    // 필터 조건
    const where: Prisma.SubmissionWhereInput = {
      userId: user.userId,
    };

    if (sentenceId) {
      where.sentenceId = parseInt(sentenceId);
    }

    // 제출 기록 조회
    const [submissions, totalCount] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        include: {
          sentence: {
            select: {
              sentence_id: true,
              english_sentence: true,
              korean_sentence: true,
              difficulty_level: true,
            },
          },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      submissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("제출 기록 조회 오류:", error);
    return NextResponse.json({ error: "제출 기록 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
