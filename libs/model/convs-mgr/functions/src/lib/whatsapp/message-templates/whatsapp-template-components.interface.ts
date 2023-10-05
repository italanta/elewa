import { TemplateButtonType } from "../../base/message-template.interface";
import { WhatsappTemplateComponentTypes } from "./whatsapp-template-component-type.enum";

export interface WhatsappNewTemplateComponent 
{
  type: WhatsappTemplateComponentTypes;
  text?: string;
}

export interface WhatsappBodyTemplateComponent extends WhatsappNewTemplateComponent 
{
  example?: {
    body_text: string[];
  };
}

export interface WhatsappFooterTemplateComponent extends WhatsappNewTemplateComponent { }

export interface WhatsappButtonsTemplateComponent extends WhatsappNewTemplateComponent 
{
  buttons: WhatsappTemplateButtons[];
}

export interface WhatsappTemplateButtons
{
  type: TemplateButtonType;
  text: string;
}

export interface WhatsappPhoneButton extends WhatsappTemplateButtons
{
  phoneNumber: string;
}

export interface WhatsappURLButton extends WhatsappTemplateButtons
{
  url: string;
}

/**
 * Quick reply buttons are custom text-only buttons that immediately message 
 *  you with the specified text string when tapped by the app user
 */
export interface WhatsappQuickReplyButton extends WhatsappTemplateButtons { }

/** Copy code buttons copy a text string (defined when the template is sent in a 
 *    template message) to the device's clipboard when tapped by the app user. 
 *      Templates are limited to one copy code button */
export interface WhatsappCopyCodeButton extends WhatsappTemplateButtons { }


