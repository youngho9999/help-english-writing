import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 현재 로그인한 사용자 정보 조회
 * Authorization: Bearer {token} 헤더 필요
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    // 사용자 정보 조회
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    if (!userData.isActive) {
      return NextResponse.json({ error: "비활성화된 계정입니다." }, { status: 403 });
    }

    return NextResponse.json({
      user: userData,
    });
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    return NextResponse.json(
      { error: "사용자 정보 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
