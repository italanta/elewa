import { MessengerAttachmentType } from "./messenger-attachment-types.enum";
import { MessengerOutgoingMessage } from "./messenger-base-outgoing-message.interface";
import { MessengerOutgoingButtons } from "./messenger-button-message-out.interface";
import { MessengerTemplateType } from "./messenger-template-types.enum";

/**
 * This interface utilises the Messenger Generic Template for sending lists of items.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/templates/generic
 */
export interface MessengerOutgoingListMessage extends MessengerOutgoingMessage { 
  message: {
    attachment: {
      type: MessengerAttachmentType.TEMPLATE;
      payload: {
        template_type:  MessengerTemplateType.GENERIC;
        elements: MessengerOutgoingListMessageElement[]
      }   
    }
  }
}

export interface MessengerOutgoingListMessageElement { 
  title: string;
  subtitle?: string;
  image_url?: string;
  default_action?: {
    type: 'web_url';
    url: string;
    webview_height_ratio?: 'compact' | 'tall' | 'full';
    messenger_extensions?: boolean;
    fallback_url?: string;
    webview_share_button?: 'hide';
  }

  buttons?: MessengerOutgoingButtons[];
}
