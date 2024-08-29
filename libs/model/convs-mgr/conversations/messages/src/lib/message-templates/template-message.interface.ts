import { Message } from "../message.interface";
import { TemplateCategoryTypes } from "./template-category-types.enum";
import { TemplateComponents } from "./template-components.interface";

/**
 * Defines a template message that can be business initiated and sent to the user outside
 *  the 24 hour window enforced by whatsapp and messenger.
 * 
 * Once the template has been created we will only need the below information to be able to send a simple
 *  message template. However there are more advanced templates like marketing templates which should be extended
 *   from this base interface.
 */
export interface TemplateMessage extends Message
{
  /** The type of the template e.g. text, interactive, media etc. */
   templateType: TemplateMessageTypes;

   category?      : TemplateCategoryTypes;

   content?       : TemplateComponents;

   /** The name of the template as configured on whatsapp business */
   name: string;

   /** The language code of the template as configured on facebook business.
    * 
    * @see https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/supported-languages
    */
   language?: string;

     /** Once the template has been created, Meta provides a unique identifier
       *  for the template. This identifier can be used to update the template
       */
   externalId?   : string;

   channelId?     : string;
}

/** 
 * Whatsapp message templates are of different types, that's why we need to create a separate class that 
 *  only focus on the template messages. This avoids bloating the main outgoing parser and creates a base to 
 *    implement the other types of message templates.
 * 
 * The below is the full list 
 *  @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates 
 * */
export enum TemplateMessageTypes {
  /** A simple text message. But can contain variables */
   Text                = 1,

   /** A template message with media (only video, image and document) 
    *    which will be included on the header */
   Image               = 2,
   Video               = 3,
   Document            = 4,

   /** A template message with a quick reply button */
   Interactive         = 5,

   /** A template message with a location cordinates which will be included on the header */
   Location            = 6,

   /** A template message used for OTP */
   Authentication      = 7,

   /** A template message used to showcase multiple products */
   MultiProduct        = 8
}

export interface ImageTemplateMessage extends TemplateMessage {
  mediaType: 'image';
  section: 'header';
  url: string;
}