"use client";

import Button from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        variant="secondary"
        className="px-6 py-3 text-base"
      >
        ← Previous
      </Button>

      <span className="text-lg font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        variant="secondary"
        className="px-6 py-3 text-base"
      >
        Next →
      </Button>
    </div>
  );
}
