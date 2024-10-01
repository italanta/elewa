import { AssessmentStatusTypes } from "@app/model/convs-mgr/micro-app/assessments";

export function PDFOutcomeMessage(outcome: AssessmentStatusTypes) {

  switch (outcome) {
    case AssessmentStatusTypes.Completed:
    case AssessmentStatusTypes.Passed:
      return "Congratulations! You passed!";
    case AssessmentStatusTypes.Failed:
      return "You did not pass";
    default:
      return "You did not pass";
  }
}