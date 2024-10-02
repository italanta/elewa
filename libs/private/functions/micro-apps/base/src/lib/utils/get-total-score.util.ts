import { QuestionResponseMap } from "@app/model/convs-mgr/micro-app/assessments";

export function getTotalScore(questionMap: QuestionResponseMap): number {
  return Object.values(questionMap).reduce((total, response) => {
    return total + (response.score || 0);
  }, 0);
}