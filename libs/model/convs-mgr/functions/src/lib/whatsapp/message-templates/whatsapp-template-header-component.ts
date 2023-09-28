import { TemplateHeaderTypes } from "../../base/message-template.interface";
import { WhatsappNewTemplateComponent } from "./whatsapp-template-components.interface";

export interface WhatsappHeaderTemplateComponent extends WhatsappNewTemplateComponent 
{
  format: TemplateHeaderTypes;
}

export interface WhatsappTextHeaderTemplateComponent extends WhatsappHeaderTemplateComponent 
{
  example?: {
    header_text: string[];
  };
}

export interface WhatsappMediaTemplateComponent extends WhatsappHeaderTemplateComponent 
{
  example?: {
    /** Uploaded media asset handle. Use the Resumable Upload API to generate an asset handle.
     * 
     * @see https://developers.facebook.com/docs/graph-api/guides/upload
    */
   header_handle: string[];
  };
}

export interface WhatsappLocationHeaderTemplateComponent extends WhatsappHeaderTemplateComponent { }