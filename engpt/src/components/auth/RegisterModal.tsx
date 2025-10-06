"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
        return;
      }

      // 회원가입 성공
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      onRegisterSuccess();

      // 폼 초기화
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      console.error("Register error:", error);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">회원가입</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium mb-2">
              이메일
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              최소 8자, 영문자와 숫자 포함
            </p>
          </div>

          <div>
            <label htmlFor="register-password-confirm" className="block text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <input
              id="register-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">이미 계정이 있으신가요? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
