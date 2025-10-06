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

// 인증 관련 타입
export interface User {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface UserResponse {
  user: User;
}

// 제출 기록 관련 타입
export interface Submission {
  id: string;
  userId: string;
  sentenceId: number;
  userAnswer: string;
  korean: string;
  score: number;
  correctedSentence: string;
  feedbackSummary: string;
  detailedFeedback: DetailedFeedback[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubmissionRequest {
  sentenceId: number;
  korean: string;
  userAnswer: string;
  score: number;
  correctedSentence: string;
  feedbackSummary: string;
  detailedFeedback: DetailedFeedback[];
}
