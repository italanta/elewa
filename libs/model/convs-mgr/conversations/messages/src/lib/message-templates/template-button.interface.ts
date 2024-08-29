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