import { MessageTypes } from "@app/model/convs-mgr/functions";
import { Location } from "@app/model/convs-mgr/stories/blocks/messaging";
import { IncomingMessagePayload } from "./payload-in.interface";

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
  /** The unique id that is assigned to the third party platform */
  id                  : string;

  /** The different types of messages our chatbot recieves from the end user, 
   *    e.g. a text message, a location, an image
   * 
   * @see {MessageTypes}
   */
  type                : MessageTypes;

  /** Unprocessed part of the message sent through a channel by a platform which contains 
   *    the actual message payload  
   */
  payload             : IncomingMessagePayload;

  /** The phone number used by the end user to send a message to  our chatbot */
  endUserPhoneNumber? : string;

  n?                  : number;

  direction?          : MessageDirection;
}

export enum MessageDirection
{
  TO_END_USER       =  'toEndUser',
  FROM_END_USER     =  'fromEndUser',

  TO_CHATBOT        =  'toChatBot',

  TO_AGENT          =  'toAgent'
}

/**
 * Standardized format of the text messsage sent by the end user
 */
export interface TextMessage extends Message 
{
  text: string;
}

export interface LocationMessage extends Message 
{
  location: Location
}

/**
 * Standardized format of the image messsage sent by the end user
 */
export interface ImageMessage extends Message 
{
  /** The provided image url, by the third party platform */
  imageId: string;
  url?: string;
}

/**
 * Standardized format of the image messsage sent by the end user
 */
 export interface AudioMessage extends Message 
 {
   /** The provided image url, by the third party platform */
   audioId: string;
   url?: string;
 }

 /**
 * Standardized format of the image messsage sent by the end user
 */
export interface VideoMessage extends Message 
{
  /** The provided image url, by the third party platform */
  videoId: string;
  url?: string;
}

 export interface QuestionMessage extends Message 
 {
   questionText?       : string;
 
   options             : QuestionMessageOptions[];
 }
 
 export interface QuestionMessageOptions 
 {
   /** The unique id of the option selected by the end user 
    * 
    *  When sending a Question Message Block to the end user, the id of the button @see {ButtonsBlockButton} is used to set the option id.
    *  
    *  So we can also use this id to determine the next block
    */
    optionId            : string;
 
    /** Message displayed as the answer */
    optionText          : string;
  
    /** Value the answer holds */
    optionValue?        : string;
 }
