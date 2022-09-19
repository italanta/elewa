import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { RawMessageData } from '@app/model/convs-mgr/conversations/messages';

import { ChatBotService } from '../services/main-chatbot.service';
import { NextBlockFactory } from '../services/next-block.factory';
import { ChatBotStore, ChatStatus, EndUser } from '../services/chatbot.store';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';


export class ProcessMessageHandler extends FunctionHandler<RawMessageData, RestResult200>
{
  /**
   * Incoming message hook from the chat platforms e.g. Whatsapp, Telegram...
   *
   * Registers incoming messages and processes them as readable information in our system.
   */
  public async execute(req: RawMessageData, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[ProcessMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));
    const chatBotRepo$ =  new ChatBotStore(tools)

    //[WIP] - Get the current platform
    const platform = req.platform

    const chatInfo  = await chatBotRepo$.getChatInfo(req.phoneNumber, platform);

    const chat = await chatBotRepo$.getChatStatus(chatInfo, platform);

    if (chat.status == ChatStatus.Running){
      await this._processMessage(req, tools, platform)
    } else if (chat.status == ChatStatus.Paused){
      tools.Logger.log(() => `[ProcessMessageHandler].execute: Chat has been paused.`);
    }
    return { success: true } as RestResult200;
  }

  private async _processMessage(msg: RawMessageData, tools: HandlerTools, platform: Platforms)
  {
    tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    const chatBotRepo$ =  new ChatBotStore(tools)

    const endUser = await chatBotRepo$.getEndUser(msg.phoneNumber)

    if(!endUser)
      tools.Logger.error(()=> `[ProcessMessageHandler]._processMessage - User not registered!`)

    const userActivity =  await chatBotRepo$.getActivity(endUser);

    if(!userActivity){
      return await this._initSession(endUser, msg, tools, platform)
    } else {
      return await this._contSession(endUser, chatBotRepo$, msg, tools, platform)
    }
  }

  /** If a chat session has not yet been recorded on this container, we create a new one and return the first block
   *  
  */
  private async _initSession(endUser: any, msg: RawMessageData, tools: HandlerTools, platform: Platforms)
  {    
    const chatService =  new ChatBotService(tools.Logger, platform)
    const firstBlock = await chatService.init(endUser, tools)

    tools.Logger.log(() => `[ProcessMessageHandler]._initSession: Session initialized ${JSON.stringify(msg)}.`);

    return firstBlock
  }


  /**
   * Gets the next block and updates the cursor
   * @param endUser 
   * @param chatService 
   * @param msg 
   * @param tools 
   * @returns 
   */
  private async _contSession(endUser: EndUser, chatBotRepo$: ChatBotStore, msg: RawMessageData, tools: HandlerTools, platform: Platforms){
    const latestBlock = await chatBotRepo$.getLatestActivity(endUser)
    const nextBlockService = new NextBlockFactory().resoveBlockType(latestBlock.type, tools)

    const nextBlock = await nextBlockService.getNextBlock(endUser, msg.message, latestBlock)

    const block = await chatBotRepo$.updateCursor(endUser, nextBlock, platform)

    return block;
  }

}
