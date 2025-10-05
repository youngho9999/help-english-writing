"use client";

import { Sentence } from "@/types";

interface SentenceRowProps {
  sentence: Sentence;
  isTranslating?: boolean;
}

export default function SentenceRow({ sentence, isTranslating = false }: SentenceRowProps) {
  const isTranslated = sentence.korean_sentence !== null;

  return (
    <tr
      className={`border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
        isTranslating ? "animate-pulse" : ""
      }`}
    >
      {/* ID */}
      <td className="px-4 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
        {sentence.sentence_id}
      </td>

      {/* English Sentence */}
      <td className="px-4 py-4 text-sm">
        <div className="max-w-md">{sentence.english_sentence}</div>
      </td>

      {/* Korean Translation */}
      <td className="px-4 py-4 text-sm">
        <div className="max-w-md">
          {isTranslating ? (
            <span className="text-blue-500">번역 중...</span>
          ) : sentence.korean_sentence ? (
            <span className="text-green-700 dark:text-green-400">{sentence.korean_sentence}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-600 italic">Not translated</span>
          )}
        </div>
      </td>

      {/* Difficulty Level */}
      <td className="px-4 py-4 text-sm text-center">
        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 font-medium">
          {sentence.difficulty_level}
        </span>
      </td>

      {/* Source */}
      <td className="px-4 py-4 text-sm">{sentence.source}</td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        {isTranslating ? (
          <span className="text-2xl">⏳</span>
        ) : isTranslated ? (
          <span className="text-2xl">✅</span>
        ) : (
          <span className="text-2xl">⏸️</span>
        )}
      </td>
    </tr>
  );
}
