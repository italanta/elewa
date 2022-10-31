import { MessageTypes } from "@app/model/convs-mgr/functions";

/** 
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 * 
 * We therefore need to convert this Incoming Message @see {IncomingMessage} to a standardized format so that our chatbot can read and process the message 
 *  regardless of the platform @see {PlatformType}
 * 
 *@type {Message} is our standardized format returned by @see {IncomingMessageParser} and passed to the bot engine.
*/
export interface Message
{
  id             : string;
  type           : MessageTypes;
}

/**
 * Standardized format of the text messsage sent by the end user
 */
export interface TextMessage extends Message 
{
  text: string;
}

/**
 * Standardized format of the image messsage sent by the end user
 */
export interface ImageMessage extends Message 
{
  link: string;
}

/**
 * Standardized format of a reply to the question block @see {QuestionMessageBlock}
 */
export interface QuestionMessage extends Message 
{
  /** The unique id of the option selected by the end user 
   * 
   *  When sending a Question Message Block to the end user, the id of the button @see {ButtonsBlockButton} is used to set the option id.
   *  
   *  So we can also use this id to determine the next block
   */
  optionId: string;

  /** Message displayed as the answer */
  optionText: string;

  /** Value the answer holds */
  optionValue?: string;
}