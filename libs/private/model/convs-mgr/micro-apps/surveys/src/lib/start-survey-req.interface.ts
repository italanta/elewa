/** The information required by the backend in order to send the survey */
export interface StartSurveyReq 
{
  /** The end users to send the survey to */
  endUserIds: string[];

  /** The id of the survey to send */
  surveyId: string;

  /** The template name of the template to send to users
   *   before starting the survey
   */
  messageTemplateId?: string;

  /** The Id of the channel to send the survey to */
  channelId: string;
}