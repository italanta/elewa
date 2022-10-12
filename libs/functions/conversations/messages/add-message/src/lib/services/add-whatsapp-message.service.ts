
import { MessagesDataService } from '@app/functions/chatbot';
import { AddMessageService } from './add-message.service';

import { BaseMessage, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
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

  async addMessage(msg: RawMessageData, channel: WhatsappChannel) {
    const whatsappMessage = msg as WhatsAppResponse

      switch (whatsappMessage.messageType) {
        case WhatsAppMessageType.TEXT:
          return await this._addTextMessage(whatsappMessage, channel)
        
        case WhatsAppMessageType.IMAGE:
          return await this._addImageMessage(whatsappMessage, channel)
           
        default:
          return await this._addTextMessage(whatsappMessage, channel)
        
      }      
  }


  protected async _addTextMessage(msg: WhatsAppResponse, channel: WhatsappChannel): Promise<BaseMessage> {

    // Convert type to text
    const textMessage = msg.message as TextMessagePayload
    
    // Create the base message object
    const newMessage: BaseMessage = {

      businessAccountId: channel.businessAccountId,
      phoneNumberId: channel.phoneNumberId,
      phoneNumber: channel.phoneNumber,
      channelName: channel.channelName,
      storyId: channel.storyId,
      orgId: channel.orgId,
      message: textMessage.text.body,
      platform: channel.channelName,
      authorizationKey: channel.authorizationKey
    };
    const savedMessage = await this._msgDataService$.saveMessage(newMessage);

    return savedMessage;
  }

  protected async _addImageMessage(msg: WhatsAppResponse, channel: WhatsappChannel): Promise<BaseMessage> {
    const imageMessage = msg.message as ImagePayload
    // Create the base message object
    const newMessage: BaseMessage = {
      channelName: channel.channelName,
      businessAccountId: channel.businessAccountId,
      phoneNumber: channel.phoneNumber,
      phoneNumberId: channel.phoneNumberId,
      storyId: channel.storyId,
      orgId: channel.orgId,
      message: imageMessage,
      platform: channel.channelName,
      authorizationKey: channel.authorizationKey
    };

    const savedMessage = await this._msgDataService$.saveMessage(newMessage);

    return savedMessage;
  }
}
