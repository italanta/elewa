export interface QuestionResponse {
  questionId: string;
  answerText: string;
  /** The id of the answer if it was a multiple choice question. */
  answerId?: string;
  correctAnswer?: string;
  feedback?: string;
  marks?: number;
  score?: number;
  correct?: boolean;
}