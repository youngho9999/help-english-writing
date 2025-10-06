import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * 사용자의 학습 통계 조회
 * Authorization: Bearer {token} 헤더 필요
 *
 * 반환 데이터:
 * - totalSubmissions: 총 제출 횟수
 * - averageScore: 평균 점수
 * - highestScore: 최고 점수
 * - lowestScore: 최저 점수
 * - recentSubmissions: 최근 10개 제출 기록
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    // 통계 데이터 조회
    const [submissions, recentSubmissions] = await Promise.all([
      prisma.submission.findMany({
        where: { userId: user.userId },
        select: { score: true },
      }),
      prisma.submission.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          score: true,
        },
      }),
    ]);

    const totalSubmissions = submissions.length;

    if (totalSubmissions === 0) {
      return NextResponse.json({
        totalSubmissions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        recentSubmissions: [],
      });
    }

    const scores = submissions.map((s: { score: number }) => s.score);
    const averageScore = Math.round(
      scores.reduce((a: number, b: number) => a + b, 0) / totalSubmissions
    );
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    return NextResponse.json({
      totalSubmissions,
      averageScore,
      highestScore,
      lowestScore,
      recentSubmissions: recentSubmissions.map((s: { score: number }) => ({ score: s.score })),
    });
  } catch (error) {
    console.error("통계 조회 오류:", error);
    return NextResponse.json({ error: "통계 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
