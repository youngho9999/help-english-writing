export interface Problem {
  id: number;
  korean: string;
  english: string;
}

export interface DetailedFeedback {
  type: "Praise" | "Suggestion";
  original: string;
  comment: string;
}

export interface FeedbackData {
  score: number;
  corrected_sentence: string;
  feedback_summary: string;
  detailed_feedback: DetailedFeedback[];
  alternative_expressions: string[];
}

export interface AppState {
  currentProblemIndex: number;
  userAnswer: string;
  feedback: FeedbackData | null;
  isLoading: boolean;
  isSubmitted: boolean;
}

// Sentences 테이블 타입
export interface Sentence {
  sentence_id: number;
  english_sentence: string;
  korean_sentence: string | null;
  difficulty_level: number;
  source: string;
}

// 페이지네이션 응답 타입
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SentencesResponse {
  sentences: Sentence[];
  pagination: PaginationMeta;
}

// 번역 결과 타입
export interface TranslationResult {
  sentence_id: number;
  english_sentence: string;
  korean_sentence: string;
  status: "success" | "error";
  error?: string;
}

export interface TranslateBatchResponse {
  success: number;
  failed: number;
  results: TranslationResult[];
}
