import { IObject } from "@iote/bricks";

/**
 * This interface defines the structure of the template payload passed so that
 *  it can be updated, created or deleted
 */
export interface MessageTemplate extends IObject {
  name          : string;
  category      : TemplateCategoryTypes;

  /**
   * The langauge of the template as per the below list
   * 
   * @see https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/supported-languages
   */
  language      : string;
  content       : TemplateComponents;

  /** Once the template has been created, Meta provides a unique identifier
   *  for the template. This identifier can be used to update the template
   */
  templateId?   : string;

  /** Number of messages sent using this template */
  sent?         : number;
} 

/**
 * Templates are made up of four primary components which you define 
 *    when you create a template: header, body, footer, and buttons. The 
 *      components you choose for each of your templates should be based on 
 *        business needs. The only required component is the body component.
 * 
 * @see https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components
 */
export interface TemplateComponents {
  /** The header can be a text but whatsapp and messenger support
   *   multi-media and location in the header, the header will have 
   *    it's own type that support this.
   * 
   * NOTE: Variables can be included in the text using curly braces - {{name}}
   */
  header?: TemplateHeader;

  /**
   * The text that will appear in the body section of the template.
   * 
   * NOTE: Variables can be included in the text using curly braces - {{name}}
   */
  body: string;

  /**
   * The text that will appear in the footer section of the template
   * 
   * NOTE: Variables can be included in the text using curly braces - {{name}}
   */
  footer?: string;

  /** Buttons are optional interactive components that perform specific 
   *  actions when tapped 
   * 
   *  Templates can have a mixture of up to 10 button components total
   * */
  buttons?: TemplateButton[];
}

export interface TemplateButton {
  type: TemplateButtonType;
  text: string;
}

/**
 * Phone number buttons call the specified business phone number when tapped 
 *    by the app user. Templates are limited to one phone number button
 */
export interface PhoneNumberButton extends TemplateButton {
  phoneNumber: string;
}

/**
 * URL buttons load the specified URL in the device's default web browser 
 *  when tapped by the app user. Templates are limited to two URL buttons.
 */
export interface URLButton extends TemplateButton {
  url: string;
}

/**
 * Quick reply buttons are custom text-only buttons that immediately message 
 *  you with the specified text string when tapped by the app user
 */
export interface QuickReplyButton extends TemplateButton { }

/** Copy code buttons copy a text string (defined when the template is sent in a 
 *    template message) to the device's clipboard when tapped by the app user. 
 *      Templates are limited to one copy code button */
export interface CopyCodeButton extends TemplateButton { }

export enum TemplateButtonType {
  /**
   * Phone number buttons call the specified business phone number when tapped 
   *    by the app user. Templates are limited to one phone number button
   */
  PhoneNumber     = 1,

  /**
   * URL buttons load the specified URL in the device's default web browser 
   *  when tapped by the app user. Templates are limited to two URL buttons.
   */
  URL             = 2,

  /**
   * Quick reply buttons are custom text-only buttons that immediately message 
   *  you with the specified text string when tapped by the app user
   */
  QuickReply      = 3,

  /** Copy code buttons copy a text string (defined when the template is sent in a 
    *    template message) to the device's clipboard when tapped by the app user. 
    *     Templates are limited to one copy code button */
  CopyCode        = 4,
  
  /** One-time password (OTP) buttons are a special type of URL button used with authentication templates. 
   *  @see https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates */
  OTP             = 5
}

export interface TemplateHeader {
  type: TemplateHeaderTypes;
}

export interface TextHeader extends TemplateHeader {
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
  Text      = 1,
  Image     = 2,
  Video     = 3,
  Document  = 4,
  Location  = 5
}

export enum TemplateCategoryTypes {
  Utility         = "UTILITY",
  Marketing       = "MARKETING",
  Authentication  = "AUTHENTICATION"
}

/** The review status of the template */
export enum TemplateStatusTypes
{
  Approved = "APPROVED",
  Pending  = "PENDING",
  Rejected = "REJECTED"
}