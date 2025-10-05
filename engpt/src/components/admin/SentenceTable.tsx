"use client";

import { Sentence } from "@/types";
import SentenceRow from "./SentenceRow";

interface SentenceTableProps {
  sentences: Sentence[];
  translatingIds?: Set<number>;
}

export default function SentenceTable({
  sentences,
  translatingIds = new Set(),
}: SentenceTableProps) {
  if (sentences.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl">문장이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-black dark:border-white rounded-xl">
      <table className="w-full">
        <thead className="bg-black dark:bg-white text-white dark:text-black">
          <tr>
            <th className="px-4 py-4 text-left text-sm font-bold">ID</th>
            <th className="px-4 py-4 text-left text-sm font-bold">English Sentence</th>
            <th className="px-4 py-4 text-left text-sm font-bold">Korean Translation</th>
            <th className="px-4 py-4 text-center text-sm font-bold">Difficulty</th>
            <th className="px-4 py-4 text-left text-sm font-bold">Source</th>
            <th className="px-4 py-4 text-center text-sm font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black">
          {sentences.map((sentence) => (
            <SentenceRow
              key={sentence.sentence_id}
              sentence={sentence}
              isTranslating={translatingIds.has(sentence.sentence_id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
