/** Response returned after starting the survey */
export interface StartSurveyResponse
{
  attempted?: number;
  usersSent?: string[];
  usersFailed?: string[];
  success: boolean;
  message?: any;
}