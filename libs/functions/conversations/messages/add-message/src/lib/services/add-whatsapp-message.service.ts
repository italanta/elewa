import { MessagesDataService } from '@app/functions/chatbot';
import { BaseMessage, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { ImagePayload, TextMessagePayload, WhatsAppMessageType, WhatsAppResponse } from '@app/model/convs-mgr/functions';
import { WhatsappChannel } from '@app/model/bot/channel';
import { AddMessageService } from './add-message.service';

export class AddWhatsappMessage extends AddMessageService<WhatsappChannel> {

  constructor(private _msgDataService$: MessagesDataService) 
  {
    super();
  }

  addMessage(msg: RawMessageData, channel: WhatsappChannel) {
    const whatsappMessage = msg as WhatsAppResponse

      switch (whatsappMessage.messageType) {
        case WhatsAppMessageType.TEXT:
          this._addTextMessage(whatsappMessage, channel)
          break;
        case WhatsAppMessageType.IMAGE:
          this._addImageMessage(whatsappMessage, channel)
          break;  
        default:
        case WhatsAppMessageType.TEXT:
          this._addTextMessage(whatsappMessage, channel)
          break;
      }      
  }


  protected async _addTextMessage(msg: WhatsAppResponse, channel: WhatsappChannel): Promise<BaseMessage> {

    const textMessage = msg.message as TextMessagePayload
    // Create the base message object
    const newMessage: BaseMessage = {
      channelId: channel.businessPhoneNumber,
      storyId: channel.storyId,
      orgId: channel.orgId,
      phoneNumber: msg.botUserPhoneNumber,
      message: textMessage.text.body,
      platform: channel.channelName,
    };
    const savedMessage = await this._msgDataService$.saveMessage(newMessage);

    return savedMessage;
  }

  protected async _addImageMessage(msg: WhatsAppResponse, channel: WhatsappChannel): Promise<BaseMessage> {
    const imageMessage = msg.message as ImagePayload
    // Create the base message object
    const newMessage: BaseMessage = {
      channelId: channel.businessPhoneNumber,
      storyId: channel.storyId,
      orgId: channel.orgId,
      phoneNumber: msg.botUserPhoneNumber,
      message: imageMessage,
      platform: channel.channelName,
    };

    const savedMessage = await this._msgDataService$.saveMessage(newMessage);

    return savedMessage;
  }
}
