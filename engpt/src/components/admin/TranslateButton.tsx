"use client";

import Button from "@/components/ui/Button";

interface TranslateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isTranslating: boolean;
  sentenceCount: number;
  progress?: number;
}

export default function TranslateButton({
  onClick,
  disabled,
  isTranslating,
  sentenceCount,
  progress = 0,
}: TranslateButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={onClick} disabled={disabled} className="px-12 py-5 text-xl">
        {isTranslating
          ? `번역 중... ${progress}/${sentenceCount}`
          : `현재 페이지 번역 (최대 ${sentenceCount}개)`}
      </Button>

      {isTranslating && (
        <div className="w-full max-w-md">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${(progress / sentenceCount) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            {Math.round((progress / sentenceCount) * 100)}% 완료
          </p>
        </div>
      )}
    </div>
  );
}
