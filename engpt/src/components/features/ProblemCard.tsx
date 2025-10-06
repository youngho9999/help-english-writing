"use client";

interface ProblemCardProps {
  korean: string;
  problemNumber: number;
  totalProblems: number;
  compact?: boolean;
}

export default function ProblemCard({
  korean,
  problemNumber,
  totalProblems,
  compact = false,
}: ProblemCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        문제 {problemNumber} / {totalProblems}
      </div>
      <div
        className={`bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl ${
          compact ? "p-4" : "p-6"
        }`}
      >
        <h2
          className={`${
            compact ? "text-base md:text-lg" : "text-xl md:text-2xl"
          } font-medium text-center leading-relaxed`}
        >
          {korean}
        </h2>
      </div>
    </div>
  );
}
