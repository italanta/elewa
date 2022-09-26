import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { ChatStatus, Message } from '@app/model/convs-mgr/conversations/messages';

import { ChatBotService } from '../services/main-chatbot.service';
import { NextBlockFactory } from '../services/next-block/next-block.factory';
import { ChatBotStore } from '../stores/chatbot.store';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Block, ChatInfo } from '@app/model/convs-mgr/conversations/chats';



export class ProcessMessageHandler extends FunctionHandler<Message, RestResult200>
{
  /**
   * Incoming message hook from the chat platforms e.g. Whatsapp, Telegram...
   *
   * Registers incoming messages and processes them as readable information in our system.
   */
  public async execute(req: Message, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[ProcessMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));
    const chatBotRepo$ =  new ChatBotStore(tools)

    //[WIP] - Get the current platform
    const platform = req.platform

    const chatInfo  = await chatBotRepo$.chatInfo().getChatInfo(req.phoneNumber, platform);

    // const chat = await chatBotRepo$.getChatStatus(chatInfo, platform);
    const block = await this._processMessage(chatInfo, req, tools, platform)
    // if (chat.status == ChatStatus.Running){
  
    // } else if (chat.status == ChatStatus.Paused){
    //   tools.Logger.log(() => `[ProcessMessageHandler].execute: Chat has been paused.`);
    // }
    // return { success: true } as RestResult200;
    return { success: true} as RestResult200
  }

  private async _processMessage(chatInfo: ChatInfo, msg: Message, tools: HandlerTools, platform: Platforms)
  {
    tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    const chatBotRepo$ =  new ChatBotStore(tools)

    // const chatInfo = await chatBotRepo$.getChatInfo(msg.phoneNumber, platform)

    if(!chatInfo)
      tools.Logger.error(()=> `[ProcessMessageHandler]._processMessage - User not registered!`)

    const userActivity =  await chatBotRepo$.cursor().getActivity(chatInfo, msg.platform);

    if(userActivity.length < 1){
      return await this._initSession(chatInfo, msg, tools, platform)
    } else {
      return await this._contSession(chatInfo, chatBotRepo$, msg, tools, platform)
    }
  }

  /** If a chat session has not yet been recorded on this container, we create a new one and return the first block
   *  
  */
  private async _initSession(endUser: any, msg: Message, tools: HandlerTools, platform: Platforms)
  {    
    const chatService =  new ChatBotService(tools.Logger, platform)
    const firstBlock = await chatService.init(msg, endUser, tools)

    tools.Logger.log(() => `[ProcessMessageHandler]._initSession: Session initialized`);

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
  private async _contSession(chatInfo: ChatInfo, chatBotRepo$: ChatBotStore, msg: Message, tools: HandlerTools, platform: Platforms){
    const chatService =  new ChatBotService(tools.Logger, platform)

    const latestActivity = await chatBotRepo$.cursor().getLatestActivity(chatInfo, platform)
    
    const latestBlock = await chatBotRepo$.blockConnections().getBlockById(latestActivity.block.id, chatInfo)
    const nextBlockService = new NextBlockFactory().resoveBlockType(latestBlock.type, tools)

    const nextBlock = await nextBlockService.getNextBlock(chatInfo, msg.message, latestBlock)

    // Handles possible race condition
    const duplicateMessage = await chatService.handleDuplicates(msg, tools)

    if (!duplicateMessage){
      const cursor = await chatBotRepo$.cursor().moveCursor(chatInfo, nextBlock, platform)

      return cursor.block;
    } else {
      return null
    }
  }

}
