"use client";

import { useState, useEffect } from "react";
import { Sentence, SentencesResponse, TranslateBatchResponse } from "@/types";
import SentenceTable from "@/components/admin/SentenceTable";
import Pagination from "@/components/admin/Pagination";
import TranslateButton from "@/components/admin/TranslateButton";

export default function TranslatePage() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingIds, setTranslatingIds] = useState<Set<number>>(new Set());
  const [translationProgress, setTranslationProgress] = useState(0);
  const [filter, setFilter] = useState<"all" | "translated" | "untranslated">("all");

  // 문장 데이터 가져오기
  const fetchSentences = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sentences?page=${page}&limit=10&filter=${filter}`);
      if (!response.ok) throw new Error("Failed to fetch sentences");

      const data: SentencesResponse = await response.json();
      setSentences(data.sentences);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.totalCount);
      setHasNext(data.pagination.hasNext);
      setHasPrev(data.pagination.hasPrev);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("문장을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSentences(page);
  };

  // 필터 변경
  const handleFilterChange = (newFilter: "all" | "translated" | "untranslated") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  // 초기 로드
  useEffect(() => {
    fetchSentences(1);
  }, [filter]);

  // 번역 실행
  const handleTranslate = async () => {
    if (sentences.length === 0) return;

    setIsTranslating(true);
    setTranslationProgress(0);

    const sentenceIds = sentences.map((s) => s.sentence_id);
    setTranslatingIds(new Set(sentenceIds));

    try {
      const response = await fetch("/api/translate-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentenceIds }),
      });

      if (!response.ok) throw new Error("Translation failed");

      const data: TranslateBatchResponse = await response.json();

      // 성공한 번역 결과로 UI 업데이트
      const updatedSentences = sentences.map((sentence) => {
        const result = data.results.find((r) => r.sentence_id === sentence.sentence_id);
        if (result && result.status === "success") {
          return { ...sentence, korean_sentence: result.korean_sentence };
        }
        return sentence;
      });

      setSentences(updatedSentences);
      setTranslationProgress(data.success);

      alert(`번역 완료!\n성공: ${data.success}개\n실패: ${data.failed}개`);
    } catch (error) {
      console.error("Translation error:", error);
      alert("번역 중 오류가 발생했습니다.");
    } finally {
      setIsTranslating(false);
      setTranslatingIds(new Set());
    }
  };

  // 통계 계산
  const translatedCount = sentences.filter((s) => s.korean_sentence !== null).length;
  const untranslatedCount = sentences.length - translatedCount;

  return (
    <div className="min-h-screen p-8 py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Translation Admin</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">영어 문장 한글 번역 관리</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2">{totalCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 문장 수</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2 text-green-700 dark:text-green-400">
              {translatedCount}
            </div>
            <div className="text-sm text-green-600 dark:text-green-500">현재 페이지 번역 완료</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2 text-red-700 dark:text-red-400">
              {untranslatedCount}
            </div>
            <div className="text-sm text-red-600 dark:text-red-500">현재 페이지 번역 대기</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-6 py-2 rounded-full border-2 transition-colors ${
              filter === "all"
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "bg-white text-black dark:bg-black dark:text-white border-gray-300 dark:border-gray-700"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => handleFilterChange("translated")}
            className={`px-6 py-2 rounded-full border-2 transition-colors ${
              filter === "translated"
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "bg-white text-black dark:bg-black dark:text-white border-gray-300 dark:border-gray-700"
            }`}
          >
            번역 완료
          </button>
          <button
            onClick={() => handleFilterChange("untranslated")}
            className={`px-6 py-2 rounded-full border-2 transition-colors ${
              filter === "untranslated"
                ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                : "bg-white text-black dark:bg-black dark:text-white border-gray-300 dark:border-gray-700"
            }`}
          >
            번역 대기
          </button>
        </div>

        {/* Pagination Top */}
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
          />
        )}

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl">로딩 중...</div>
          </div>
        ) : (
          <SentenceTable sentences={sentences} translatingIds={translatingIds} />
        )}

        {/* Translate Button */}
        {!isLoading && sentences.length > 0 && (
          <div className="py-8">
            <TranslateButton
              onClick={handleTranslate}
              disabled={isTranslating || sentences.length === 0}
              isTranslating={isTranslating}
              sentenceCount={sentences.length}
              progress={translationProgress}
            />
          </div>
        )}

        {/* Pagination Bottom */}
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
