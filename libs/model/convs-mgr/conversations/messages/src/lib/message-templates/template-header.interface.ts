import { TemplateVariableExample } from "./template-example.interface";

export interface TemplateHeader {
  type: TemplateHeaderTypes;
  /** If using variables in the header text or media, you have to provide an example of the variables value or
   * an asset(media) that might be used.
   */
  examples?: TemplateVariableExample[];
}

export interface TextHeader extends TemplateHeader {

  /** Text to appear in template header when sent. Supports 1 variable. */
  text: string;
}

export interface MediaHeader extends TemplateHeader {
  fileName: string;
  url: string;
}

export interface ImageHeader extends MediaHeader { }
export interface VideoHeader extends MediaHeader { }
export interface DocumentHeader extends MediaHeader { }

/**
 * Location headers can only be used in templates categorized as UTILITY or MARKETING. 
 *    Real-time locations are not supported.
 * 
 * The location information is not needed when creating the template because it should only
 *  be included when sending the message template.
 * -- CREATING --
 * @see https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components#location-headers
 * 
 * -- SENDING --
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates#location
 * 
 * Therefore the location information should be saved to the Database for later use
 */
export interface LocationHeader extends TemplateHeader {
  format: 'LOCATION';
}

export enum TemplateHeaderTypes {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  LOCATION = 'LOCATION'
}

export const isMediaHeader = (templateHeaderTypes: TemplateHeaderTypes) => {
  switch (templateHeaderTypes) {
    case TemplateHeaderTypes.IMAGE:
      return true;
    case TemplateHeaderTypes.VIDEO:
      return true;
    default:
      return false;
  }
}