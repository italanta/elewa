import { QuestionResponse } from "./assessment-question-response.interface";
import { AssessmentStatusTypes } from "./assessment-status-types.enum";

export interface Attempt {
  /** Score of this specific attempt */
   startedOn: number;
   score: number;
   questionResponses: QuestionResponseMap;
   finishedOn?: number;
   outcome?: AssessmentStatusTypes; 
   finalScorePercentage?: number;
  }

export type QuestionResponseMap = { [key: string]: QuestionResponse };
