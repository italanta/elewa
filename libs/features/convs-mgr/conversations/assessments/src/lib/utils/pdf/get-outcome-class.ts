import { AssessmentStatusTypes } from "@app/model/convs-mgr/micro-app/assessments";

export function getOutcomeClass(outcome: AssessmentStatusTypes) {
  switch (outcome) {
    case AssessmentStatusTypes.Completed:
    case AssessmentStatusTypes.Passed:
      return "pass";
    case AssessmentStatusTypes.Failed:
      return "fail";
    default:
      return "fail";
  }
}