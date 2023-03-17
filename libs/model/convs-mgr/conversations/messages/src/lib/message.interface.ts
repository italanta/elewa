import { IObject } from "@iote/bricks";

import { MessageTypes } from "@app/model/convs-mgr/functions";
import { Location } from "@app/model/convs-mgr/stories/blocks/messaging";

import { IncomingMessagePayload } from "./payload-in.interface";
import { MessageParams } from "./message-params.interface";

/** 
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ...
 * 
 * We therefore need to convert this Incoming Message @see {IncomingMessage} to a standardized format so that our chatbot can read and process the message 
 *  regardless of the platform @see {PlatformType}
 * 
 *@type {Message} is our standardized format returned by @see {IncomingMessageParser} and passed to the bot engine.
*/
export interface Message extends IObject
{
  /** The unique id that is assigned to the third party platform */
  id?                 : string;

  /** The different types of messages our chatbot recieves from the end user, 
   *    e.g. a text message, a location, an image
   * 
   * @see {MessageTypes}
   */
  type                : MessageTypes;

  /** Unprocessed part of the message sent through a channel by a platform which contains 
   *    the actual message payload  
   */
  payload?            : IncomingMessagePayload;

  /** The phone number used by the end user to send a message to  our chatbot */
  endUserPhoneNumber? : string;

  n?                  : number;

  /** 
   * Since we have messages from different sources, it's best we define their direction
   *   so that we can properly identify the message.
   * 
   * Also helps third party applications to do the same.
   */
  direction?          : MessageDirection;

  url?                : string;

  params?             : MessageParams[];
}


/** 
 * Since we have messages from different sources, it's best we define their direction
 *   so that we can properly identify the message.
 * 
 * Also helps third party applications to do the same.
 */
export enum MessageDirection
{
  TO_END_USER       =  5,

  FROM_END_USER     =  10,

  TO_CHATBOT        =  15,

  TO_AGENT          =  20
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

export interface FileMessage extends Message
{
  mediaId?        : string;
  url?            : string;
  mime_type?      : string
}

export interface AudioMessage extends FileMessage {}

export interface VideoMessage extends FileMessage {}

export interface ImageMessage extends FileMessage {}


/**
 * Standardized format of a reply to the question block @see {QuestionMessageBlock}
 */

export interface QuestionMessage extends Message 
{
  questionText?       : string;

  options?             : QuestionMessageOptions[];
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
