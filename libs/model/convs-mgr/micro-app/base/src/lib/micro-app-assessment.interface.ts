/** Micro-app specific assessment questions interface
 * Different from the normal assessment since it won't be turned into a story
 */
export interface MicroAppAssessmentQuestion {
  id: string;
  /** Specific question */
  message: string;
  /** If a question allows multiple options */
  questionType: AssessmentQuestionType;
  /** Points for the assessment */
  marks: number;
  /** Explanation to answers */
  feedback?: AssessmentFeedBack;
  /** List of possible choices */
  options?: AssessmentQuestionOptions[];
  prevQuestionId?: string;
  nextQuestionId?: string;
}

/** Format which an assessment answer should follow */
export interface AssessmentQuestionOptions {
  id: string;
  /** Exact choice text */
  text: string;
  accuracy: AssessmentOptionValue;
  /** Explanation as to why an answer is right or wrong */
  feedback: string;
}

/** Explanation to answers */
export interface AssessmentFeedBack {
  message: string;
  condition: FeedbackCondition;
}

/** Enum tracking accuracy of answers */
export enum FeedbackCondition {
  Correct = 1,
  Wrong = 2,
  FiftyFifty = 3,
}

/** Type of question, allows single choice answers for now */
export enum AssessmentQuestionType {
  SingleSelectOptions = 1,
}

/** Accuracy of an answer */
export enum AssessmentOptionValue {
  Correct = 1,
  Wrong = 2,
  FiftyFifty = 3,
}
