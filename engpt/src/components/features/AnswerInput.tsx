"use client";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onSubmit?: () => void;
}

export default function AnswerInput({
  value,
  onChange,
  disabled = false,
  onSubmit,
}: AnswerInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter (Mac) 또는 Ctrl+Enter (Windows)
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (onSubmit && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <label
        htmlFor="answer"
        className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        영어로 작문하세요
      </label>
      <textarea
        id="answer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your answer in English..."
        className="w-full h-32 px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-700 rounded-xl
                   bg-white dark:bg-black text-black dark:text-white
                   focus:outline-none focus:border-black dark:focus:border-white
                   transition-colors duration-200 resize-none
                   disabled:opacity-50 disabled:cursor-not-allowed
                   placeholder:text-gray-400 dark:placeholder:text-gray-600"
      />
    </div>
  );
}
