import { QuestionResponse } from "./assessment-question-response.interface";

export interface Attempt {
  /** Score of this specific attempt */
   startedOn: number;
   score: number;
   questionResponses: QuestionResponseMap;
   finishedOn?: number;
  }

export type QuestionResponseMap = { [key: string]: QuestionResponse };
