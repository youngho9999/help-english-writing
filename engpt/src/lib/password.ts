import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * 비밀번호 해싱
 * @param password - 평문 비밀번호
 * @returns 해시된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

/**
 * 비밀번호 검증
 * @param password - 평문 비밀번호
 * @param hashedPassword - 해시된 비밀번호
 * @returns 일치 여부
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

/**
 * 비밀번호 유효성 검사
 * @param password - 검사할 비밀번호
 * @returns 유효성 검사 결과
 */
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password) {
    return { valid: false, message: "비밀번호를 입력해주세요." };
  }

  if (password.length < 8) {
    return { valid: false, message: "비밀번호는 최소 8자 이상이어야 합니다." };
  }

  if (password.length > 100) {
    return { valid: false, message: "비밀번호는 100자를 초과할 수 없습니다." };
  }

  // 최소한 영문자와 숫자를 포함해야 함
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      valid: false,
      message: "비밀번호는 영문자와 숫자를 포함해야 합니다.",
    };
  }

  return { valid: true };
}
