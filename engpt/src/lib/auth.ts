import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader, JWTPayload } from "./jwt";

/**
 * API 라우트에서 인증을 확인하는 미들웨어 함수
 * @param request - Next.js Request 객체
 * @returns 인증된 사용자 정보 또는 null
 */
export function authenticate(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

/**
 * 보호된 API 라우트를 위한 인증 확인 및 에러 응답 반환
 * @param request - Next.js Request 객체
 * @returns 인증된 사용자 정보 또는 에러 응답
 */
export function requireAuth(request: NextRequest): { user: JWTPayload } | { error: NextResponse } {
  const user = authenticate(request);

  if (!user) {
    return {
      error: NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 }),
    };
  }

  return { user };
}
