"use client";

interface ProblemCardProps {
  korean: string;
  problemNumber: number;
  totalProblems: number;
}

export default function ProblemCard({ korean, problemNumber, totalProblems }: ProblemCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        문제 {problemNumber} / {totalProblems}
      </div>
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-8">
        <h2 className="text-2xl md:text-3xl font-medium text-center leading-relaxed">{korean}</h2>
      </div>
    </div>
  );
}
