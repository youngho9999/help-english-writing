import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 계정 활성화 상태 확인
    if (!user.isActive) {
      return NextResponse.json({ error: "비활성화된 계정입니다." }, { status: 403 });
    }

    // 비밀번호 검증
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성 (2시간 유효)
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      message: "로그인 성공",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json({ error: "로그인 중 오류가 발생했습니다." }, { status: 500 });
  }
}
