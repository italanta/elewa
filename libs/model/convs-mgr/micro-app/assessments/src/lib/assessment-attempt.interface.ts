import { QuestionResponse } from "./assessment-question-response.interface";

export interface Attempt {
  /** Score of this specific attempt */
   score: number;
   questionResponses: QuestionResponse[];
  }