import { IncomingMessagePayload } from "@app/model/convs-mgr/conversations/messages";
import { Location } from "@app/model/convs-mgr/stories/blocks/messaging";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * The type of object Whatsapp Business API sends to us when it receives a message.
 * This is called a "Response" object in WhatsApp Business API.
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */
export interface IncomingWhatsAppMessage 
{
  object: string;
  entry: WhatsAppEntryFormData[];
}

export interface WhatsAppEntryFormData {
  /** Id of business that owns the bot account. */
  id: string;

  /** Information about messsage sent by the bot user, the bot account. */
  changes: WhatsAppEntryFormDataChanges[];
}

export interface WhatsAppEntryFormDataChanges 
{
  value: {
    /** Refers to meta products such as whatsapp, instagram and messenger. */
    messagingProduct: string;

    /** Information about the botAccount. */
    metadata: { display_phone_number: string; phone_number_id: string };

    contacts: {
      /** Name of bot user */
      profile: {name:string},
  
      /** Phone number of bot user */
      wa_id: string
    }[],

    messages : WhatsAppMessagePayLoad[];

    info?: {} //specific webhook payload info can be added
  },

  //Extra 
  field?: string,
}

/**
 * @important ! 
 * 
 * This is the part of the WhatsApi which we can convert into a system-readable message.
 */
export interface WhatsAppMessagePayLoad extends IncomingMessagePayload
{
  from: string,
  id: string,
  timeStamp: string,
  type: WhatsAppMessageType
}

  export interface TextMessagePayload extends WhatsAppMessagePayLoad 
  {
    text: {
      body: string,
      preview_url?: boolean
    }
  }

  export interface ImagePayload extends WhatsAppMessagePayLoad {
    mime_type: string;
    sha256:string;
    id: string
  }

  export interface AudioPayload extends WhatsAppMessagePayLoad {
    mime_type: string;
    sha256:string;
    id: string
  }

  export interface VideoPayload extends WhatsAppMessagePayLoad {
    mime_type: string;
    sha256:string;
    id: string
  }

  export interface LocationPayload extends WhatsAppMessagePayLoad {
    location: Location
  }

export interface InteractiveRawButtonReplyMessage extends WhatsAppMessagePayLoad
{
  interactive: {
    type: InteractiveMessageType,
    button_reply: {
      id: string,
      title: string,
    };
  };

}

export interface WhatsappInteractiveMessage extends WhatsAppMessagePayLoad
{
  interactive: {
    type: InteractiveMessageType,
  };
}

export interface InteractiveListReplyMessage extends WhatsAppMessagePayLoad
{
  interactive: {
    type: InteractiveMessageType,
    list_reply: {
      id: string,
      title: string,
      description: string;
    };

  };
}

export enum InteractiveMessageType 
{
  ButtonReply = 'button_reply',
  ListReply = 'list_reply'
}

