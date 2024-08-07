import { AssessmentStatusTypes } from "./assessment-status-types.enum";

export interface AssessmentUserResults {
  name: string,
  phoneNumber: string,
  dateDone: Date,
  score: number,
  scoreCategory: AssessmentStatusTypes
}