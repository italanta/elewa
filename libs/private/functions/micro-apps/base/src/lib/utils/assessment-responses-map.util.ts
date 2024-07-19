import { QuestionResponse, QuestionResponseMap } from "@app/model/convs-mgr/micro-app/assessments";

export function mapResponses(responses: QuestionResponse[], existingMap: QuestionResponseMap = {}): QuestionResponseMap {
  // Create a copy of the existing map to avoid direct mutation
  const updatedMap = { ...existingMap };

  responses.forEach(response => {
    updatedMap[response.questionId] = response;
  });

  return updatedMap;
}