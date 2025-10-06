"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DetailedFeedback {
  type: "Praise" | "Suggestion";
  original: string;
  comment: string;
}

interface Submission {
  id: string;
  sentenceId: number;
  userAnswer: string;
  korean: string;
  score: number;
  correctedSentence: string;
  feedbackSummary: string;
  detailedFeedback: DetailedFeedback[];
  createdAt: string;
  sentence?: {
    sentence_id: number;
    english_sentence: string;
    difficulty_level: number;
  };
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Stats {
  totalSubmissions: number;
  averageScore: number;
  recent30Average?: number;
}

export default function MySubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/");
      return;
    }

    fetchSubmissions(currentPage);
  }, [currentPage, router]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchSubmissions = async (page: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/submissions?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("제출 기록을 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setSubmissions(data.submissions);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Fetch submissions error:", error);
      alert("제출 기록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/submissions/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("통계를 가져오는데 실패했습니다.");
      }

      const data = await response.json();

      // 최근 30개 평균 계산
      const recent30 = data.recentSubmissions?.slice(0, 30) || [];
      let recent30Average: number | undefined = undefined;

      if (recent30.length >= 30) {
        const sum = recent30.reduce((acc: number, sub: Submission) => acc + sub.score, 0);
        recent30Average = Math.round(sum / 30);
      }

      setStats({
        totalSubmissions: data.totalSubmissions,
        averageScore: data.averageScore,
        recent30Average,
      });
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold">EngPT</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">영어 작문 연습 플랫폼</p>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">내 답변 기록</h2>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-all duration-200"
          >
            학습하기
          </Link>
        </div>

        {/* 통계 카드 */}
        {stats && stats.totalSubmissions > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* 전체 평균 */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:border-black dark:hover:border-white transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">전체 평균 점수</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    총 {stats.totalSubmissions}개 답변
                  </p>
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}점
                </div>
              </div>
            </div>

            {/* 최근 30개 평균 */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:border-black dark:hover:border-white transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">최근 30개 평균</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {stats.recent30Average ? "최근 30개 답변" : "30개 이상 필요"}
                  </p>
                </div>
                {stats.recent30Average ? (
                  <div className={`text-4xl font-bold ${getScoreColor(stats.recent30Average)}`}>
                    {stats.recent30Average}점
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-gray-300 dark:text-gray-700">-</div>
                )}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 mb-4">아직 제출한 답변이 없습니다.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
              학습 시작하기
            </Link>
          </div>
        ) : (
          <>
            {/* Submissions List */}
            <div className="space-y-4">
              {submissions.map((submission) => {
                const isExpanded = expandedId === submission.id;
                return (
                  <div
                    key={submission.id}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-all"
                  >
                    {/* 요약 뷰 - 항상 표시 */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {new Date(submission.createdAt).toLocaleDateString("ko-KR")}
                          </p>
                          <p className="text-base font-medium mb-2">{submission.korean}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {submission.userAnswer}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
                            {submission.score}점
                          </div>
                          <div className="text-gray-400">{isExpanded ? "▲" : "▼"}</div>
                        </div>
                      </div>
                    </div>

                    {/* 상세 뷰 - 확장 시에만 표시 */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        {/* User Answer */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            내 답변
                          </p>
                          <p className="text-base">{submission.userAnswer}</p>
                        </div>

                        {/* Original English */}
                        {submission.sentence && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              정답
                            </p>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                              {submission.sentence.english_sentence}
                            </p>
                          </div>
                        )}

                        {/* Corrected Sentence */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            수정된 문장
                          </p>
                          <p className="text-base text-blue-600 dark:text-blue-400">
                            {submission.correctedSentence}
                          </p>
                        </div>

                        {/* Feedback Summary */}
                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            종합 피드백
                          </p>
                          <p className="text-sm">{submission.feedbackSummary}</p>
                        </div>

                        {/* Detailed Feedback */}
                        {submission.detailedFeedback && submission.detailedFeedback.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              상세 피드백
                            </p>
                            {submission.detailedFeedback.map((feedback, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg ${
                                  feedback.type === "Praise"
                                    ? "bg-green-50 dark:bg-green-900/20"
                                    : "bg-yellow-50 dark:bg-yellow-900/20"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span
                                    className={`text-sm font-medium ${
                                      feedback.type === "Praise"
                                        ? "text-green-700 dark:text-green-400"
                                        : "text-yellow-700 dark:text-yellow-400"
                                    }`}
                                  >
                                    {feedback.type === "Praise" ? "👍 칭찬" : "💡 제안"}
                                  </span>
                                </div>
                                {feedback.original && (
                                  <p className="text-sm mt-1 font-mono">{feedback.original}</p>
                                )}
                                <p className="text-sm mt-1">{feedback.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-black dark:hover:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
