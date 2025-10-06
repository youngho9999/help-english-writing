"use client";

import { useState, useEffect } from "react";
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

  const handleNext = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setUserAnswer("");
      setFeedback(null);
      setIsSubmitted(false);
    } else {
      // 모든 문제를 완료한 경우
      if (confirm("모든 문제를 완료했습니다! 처음부터 다시 시작하시겠습니까?")) {
        setCurrentProblemIndex(0);
        setUserAnswer("");
        setFeedback(null);
        setIsSubmitted(false);
      }
    }
  };

  // 로딩 중
  if (isLoadingProblems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">문제를 불러오는 중...</h1>
        </div>
      </div>
    );
  }

  // 문제가 없을 때
  if (problems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">문제가 없습니다</h1>
          <p className="text-gray-600 dark:text-gray-400">
            데이터베이스에 한국어 번역이 있는 문장을 추가해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 py-16">
      <div className="w-full max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">EngPT</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">영어 작문 연습 플랫폼</p>
        </div>

        {/* Problem Card */}
        <ProblemCard
          korean={currentProblem.korean}
          problemNumber={currentProblemIndex + 1}
          totalProblems={problems.length}
        />

        {/* Answer Input */}
        {!isSubmitted && (
          <AnswerInput value={userAnswer} onChange={setUserAnswer} disabled={isLoading} />
        )}

        {/* Feedback Display */}
        {isSubmitted && feedback && (
          <FeedbackDisplay
            feedback={feedback}
            userAnswer={userAnswer}
            correctEnglish={currentProblem.english}
          />
        )}

        {/* Buttons - Always visible */}
        <div className="flex justify-center gap-4">
          {!isSubmitted && (
            <Button onClick={handleSubmit} disabled={!userAnswer.trim() || isLoading}>
              {isLoading ? "평가 중..." : "제출하기"}
            </Button>
          )}
          <Button onClick={handleNext} variant="secondary">
            {currentProblemIndex < problems.length - 1 ? "다음 문제" : "처음으로"}
          </Button>
        </div>
      </div>
    </div>
  );
}
