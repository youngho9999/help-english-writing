"use client";

import { FeedbackData } from "@/types";

interface FeedbackDisplayProps {
  feedback: FeedbackData;
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Score */}
      <div className="text-center">
        <div className="inline-block px-6 py-3 rounded-full bg-blue-500 text-white text-2xl font-bold">
          {feedback.score}점
        </div>
      </div>

      {/* Corrected Answer */}
      <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 text-green-900 dark:text-green-100">✓ 정답 예시</h3>
        <p className="text-xl text-green-800 dark:text-green-200">{feedback.correctedAnswer}</p>
      </div>

      {/* Grammar Issues */}
      {feedback.grammar.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3 text-red-900 dark:text-red-100">⚠ 문법 체크</h3>
          <ul className="space-y-2">
            {feedback.grammar.map((issue, index) => (
              <li key={index} className="text-red-800 dark:text-red-200 flex items-start">
                <span className="mr-2">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-500 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">💡 개선 제안</h3>
          <ul className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-blue-800 dark:text-blue-200 flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
