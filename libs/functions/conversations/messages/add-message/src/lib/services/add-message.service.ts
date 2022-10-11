import { ChatBotStore, MessagesDataService } from "@app/functions/chatbot";
import { Platforms } from "@app/model/bot/main/provider";
import { BaseMessage, RawMessageData } from "@app/model/convs-mgr/conversations/messages";

export class AddMessageService {
    constructor(private _msgDataService$: MessagesDataService){}

    async addMessage(msg: RawMessageData, platform: Platforms): Promise<BaseMessage>{

        const newMessage: BaseMessage  =  {
          phoneNumber: msg.phoneNumber,
          message: msg.message,
          platform
        }
    
        const savedMessage = await this._msgDataService$.saveMessage()
       
        return savedMessage
      }
    
      getPlatform(msg: RawMessageData): Platforms{
    
        // [Work In Progress]
        // TODO: Implement a way of resolving the platform from the incoming message data
    
        return msg.platform
      }


}