import { QuestionResponse } from "./assessment-question-response.interface";

export interface Attempt {
  /** Score of this specific attempt */
   startedOn: Date;
   score: number;
   questionResponses: QuestionResponse[];
   finishedOn?: Date;
  }