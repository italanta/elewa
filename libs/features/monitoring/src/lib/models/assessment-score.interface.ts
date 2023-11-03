import { Assessment } from "@app/model/convs-mgr/conversations/assessments";

export interface AssessmentScore {
  assessment: Assessment;
  scores: number[];
}
