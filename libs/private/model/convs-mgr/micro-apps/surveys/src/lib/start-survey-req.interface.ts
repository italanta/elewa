/** The information required by the backend in order to send the survey */
export interface StartSurveyReq 
{
  /** The users to send the survey to */
  enrolledUserIds: string[];

  /** The id of the survey to send */
  surveyId: string;

  /** The template name of the template to send to users
   *   before starting the survey
   */
  messageTemplateName?: string;

  /** The Id of the channel to send the survey to */
  channelId: string;
}