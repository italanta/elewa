/** This interface represents the message template configuration 
 *   which can be used to opt-in users to the chatbot
 */
export interface MessageTemplateConfig
{
  /** Name of the message template */
  name: string;

  /** The language of the message template e.g. 'en_US' for English(US) */
  languageCode: string;

  /** This represents the variables to be replaced in the text message 
   *   e.g. if the template is 'Hello {1}, how are you?' and the params are ['John'],
   *  then the final message will be 'Hello John, how are you?'
   * 
  */
  params: string[];
}
