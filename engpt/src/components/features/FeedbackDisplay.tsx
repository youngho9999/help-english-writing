"use client";

import { FeedbackData } from "@/types";

interface FeedbackDisplayProps {
  feedback: FeedbackData;
  userAnswer: string;
  correctEnglish: string;
}

export default function FeedbackDisplay({
  feedback,
  userAnswer,
  correctEnglish,
}: FeedbackDisplayProps) {
  const praiseFeedback = feedback.detailed_feedback.filter((f) => f.type === "Praise");
  const suggestionFeedback = feedback.detailed_feedback.filter((f) => f.type === "Suggestion");

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Score & Summary */}
      <div className="text-center space-y-3">
        <div className="inline-block px-4 py-2 rounded-full bg-blue-500 text-white text-lg font-bold">
          {feedback.score}점
        </div>
        <p className="text-base text-gray-700 dark:text-gray-300">{feedback.feedback_summary}</p>
      </div>

      {/* User's Answer */}
      <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">📝 내가 쓴 문장</h3>
        <p className="text-xl text-gray-800 dark:text-gray-200">{userAnswer}</p>
      </div>

      {/* Corrected Sentence */}
      <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 text-green-900 dark:text-green-100">
          ✓ 개선된 문장 -{" "}
          <span className="text-base font-normal">당신의 문장을 고쳐본 버전이에요</span>
        </h3>
        <p className="text-xl text-green-800 dark:text-green-200">{feedback.corrected_sentence}</p>
      </div>

      {/* Correct Answer (Reference) */}
      <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-400 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">
          🎯 모범 답안 -{" "}
          <span className="text-base font-normal">가장 자연스러운 영어 표현이에요</span>
        </h3>
        <p className="text-xl text-blue-800 dark:text-blue-200">{correctEnglish}</p>
      </div>

      {/* Praise */}
      {praiseFeedback.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-950 border-2 border-purple-500 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-purple-900 dark:text-purple-100">
            👏 잘한 점
          </h3>
          <ul className="space-y-3">
            {praiseFeedback.map((item, index) => (
              <li key={index} className="text-purple-800 dark:text-purple-200">
                <span className="font-semibold">&quot;{item.original}&quot;</span>
                <p className="mt-1 ml-4">{item.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestionFeedback.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950 border-2 border-orange-500 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-orange-900 dark:text-orange-100">
            💡 개선할 점
          </h3>
          <ul className="space-y-3">
            {suggestionFeedback.map((item, index) => (
              <li key={index} className="text-orange-800 dark:text-orange-200">
                <span className="font-semibold">&quot;{item.original}&quot;</span>
                <p className="mt-1 ml-4">{item.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
