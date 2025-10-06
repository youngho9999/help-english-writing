"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProblemCard from "@/components/features/ProblemCard";
import AnswerInput from "@/components/features/AnswerInput";
import FeedbackDisplay from "@/components/features/FeedbackDisplay";
import Button from "@/components/ui/Button";
import { FeedbackData, Problem } from "@/types";

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [isMac, setIsMac] = useState(false);

  // OS 감지
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // 문제 가져오기
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/questions");
        if (!response.ok) {
          throw new Error("문제를 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        setProblems(data.questions);
      } catch (error) {
        console.error("Fetch problems error:", error);
        alert("문제를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoadingProblems(false);
      }
    };

    fetchProblems();
  }, []);

  const currentProblem = problems[currentProblemIndex];

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          korean: currentProblem.korean,
          english: currentProblem.english,
          userAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("평가 요청에 실패했습니다.");
      }

      const data: FeedbackData = await response.json();
      setFeedback(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setUserAnswer("");
      setFeedback(null);
      setIsSubmitted(false);
    } else {
      // 10번째 문제 완료 - 새로운 문제 세트 가져오기
      try {
        // 현재 문제들 중 최대 ID 찾기
        const maxId = Math.max(...problems.map((p) => p.id));
        const offset = maxId + 1;

        setIsLoadingProblems(true);
        const response = await fetch(`/api/questions?offset=${offset}`);
        if (!response.ok) {
          throw new Error("문제를 가져오는데 실패했습니다.");
        }
        const data = await response.json();

        if (data.questions && data.questions.length > 0) {
          setProblems(data.questions);
          setCurrentProblemIndex(0);
          setUserAnswer("");
          setFeedback(null);
          setIsSubmitted(false);
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Fetch next problems error:", error);
        alert("새로운 문제를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoadingProblems(false);
      }
    }
  };

  const handleRetry = () => {
    setUserAnswer("");
    setFeedback(null);
    setIsSubmitted(false);
  };

  // 문제가 로드되지 않았으면 아무것도 렌더링하지 않음
  if (!currentProblem) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header - Left Top */}
      <Link
        href="/"
        className="inline-block mb-8 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <h1 className="text-2xl font-bold">EngPT</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">영어 작문 연습 플랫폼</p>
      </Link>

      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Problem Card */}
        <ProblemCard
          korean={currentProblem.korean}
          problemNumber={currentProblemIndex + 1}
          totalProblems={problems.length}
          compact={isSubmitted}
        />

        {/* Answer Input */}
        {!isSubmitted && (
          <AnswerInput
            value={userAnswer}
            onChange={setUserAnswer}
            disabled={isLoading}
            onSubmit={handleSubmit}
          />
        )}

        {/* Feedback Display */}
        {isSubmitted && feedback && (
          <FeedbackDisplay
            feedback={feedback}
            userAnswer={userAnswer}
            correctEnglish={currentProblem.english}
          />
        )}

        {/* Submit Button - Only visible when not submitted */}
        {!isSubmitted && (
          <div className="flex justify-center">
            <Button onClick={handleSubmit} disabled={!userAnswer.trim() || isLoading}>
              <span className="flex items-center gap-3">
                <span>{isLoading ? "평가 중..." : "제출하기"}</span>
                {!isLoading && (
                  <span className="flex items-center gap-0.5 text-base opacity-80">
                    <kbd className="font-mono text-lg">{isMac ? "⌘" : "Ctrl"}</kbd>
                    <kbd className="font-mono text-xl">↵</kbd>
                  </span>
                )}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Navigation Buttons - Right Side */}
      {isSubmitted && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
          <Button onClick={handleRetry} variant="primary" className="shadow-lg">
            재시도
          </Button>
          <Button onClick={handleNext} variant="secondary" className="shadow-lg">
            다음 문제
          </Button>
        </div>
      )}

      {/* Fixed Next Button - When not submitted */}
      {!isSubmitted && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
          <Button onClick={handleNext} variant="secondary" className="shadow-lg">
            다음 문제
          </Button>
        </div>
      )}
    </div>
  );
}
