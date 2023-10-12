import { SurveyCursor } from "@app/model/convs-mgr/conversations/admin/system";

export interface SurveyResults extends SurveyCursor
{
  questions: QuestionResponses[];
}

export interface QuestionResponses 
{
  questionId: string, 
  reponseId: string
}
