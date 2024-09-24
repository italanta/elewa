/**
 * Enum to differentiate different types of views
 * To be used in shared components between the assessment and question bank
 */
export enum QuestionFormMode 
{
  /** Form belongs to an assessment */
  AssessmentMode = 1,
  /** Form belongs to a question bank  */
  QuestionBankMode = 2
}