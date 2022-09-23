import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { Message, RawMessageData } from '@app/model/convs-mgr/conversations/messages';

import { ChatBotStore } from '@app/functions/chatbot';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';


export class AddMessageHandler extends FunctionHandler<RawMessageData, Message>
{
  /**
   * Registers incoming messages in the messages collection which triggers the processMessage handler
   */
  public async execute(req: RawMessageData, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[AddMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));
    const chatBotRepo$ =  new ChatBotStore(tools)

    const platform = this._getPlatform(req)

   return await this._addMessage(req, platform, chatBotRepo$)

  }


  private async _addMessage(msg: RawMessageData, platform: Platforms, chatBotRepo$: ChatBotStore): Promise<Message>{

    const newMessage: Message  =  {
      phoneNumber: msg.phoneNumber,
      message: msg.message,
      platform
    }

    const savedMessage = await chatBotRepo$.saveMessage(newMessage)
   
    return savedMessage
  }

  private _getPlatform(msg: RawMessageData): Platforms{

    // [Work In Progress]
    // TODO: Implement a way of resolving the platform from the incoming message data

    return msg.platform
  }



}
