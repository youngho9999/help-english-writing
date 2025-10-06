import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_EXPIRY = "2h"; // 2시간

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * JWT 토큰 생성
 * @param payload - 토큰에 담을 사용자 정보
 * @returns JWT 토큰 문자열
 */
export function generateToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET이 설정되지 않았습니다.");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * JWT 토큰 검증 및 디코딩
 * @param token - 검증할 JWT 토큰
 * @returns 디코딩된 페이로드 또는 null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET이 설정되지 않았습니다.");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT 검증 실패:", error);
    return null;
  }
}

/**
 * Authorization 헤더에서 토큰 추출
 * @param authHeader - Authorization 헤더 값 (Bearer {token})
 * @returns 토큰 문자열 또는 null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}
