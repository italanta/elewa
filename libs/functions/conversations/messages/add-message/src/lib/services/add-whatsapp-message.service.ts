
import { MessagesDataService } from '@app/functions/chatbot';
import { AddMessageService } from './add-message.service';

import { BaseMessage, IncomingMessage } from '@app/model/convs-mgr/conversations/messages';
import { ImagePayload, TextMessagePayload, WhatsAppMessageType, WhatsAppResponse } from '@app/model/convs-mgr/functions';
import { WhatsappChannel } from '@app/model/bot/channel';

/** Called by data from the webhook - inteprates and saves whatsapp messages 
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
 * 
 * The data is received in the below generic format
 * {
  "object": "whatsapp_business_account",
  "entry": [{
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [{
          "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                  "display_phone_number": "PHONE_NUMBER",
                  "phone_number_id": "PHONE_NUMBER_ID"
              },
              ...specific Webhooks payload            
          },
          "field": "messages"
        }]
    }]
}
*/
export class AddWhatsappMessage extends AddMessageService<WhatsappChannel> {

  constructor(private _msgDataService$: MessagesDataService) 
  {
    super();
  }

  async addMessage(msg: BaseMessage, channel: WhatsappChannel) {

    const savedMessage = await this._msgDataService$.saveMessage(msg, channel.storyId);

    return savedMessage
  }
}
