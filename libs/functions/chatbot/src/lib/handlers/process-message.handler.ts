import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { ChatBotService } from '../services/main-chatbot.service';
import { NextBlockFactory } from '../services/next-block/next-block.factory';
import { ChatBotStore } from '../stores/chatbot.store';

import { Message } from '@app/model/convs-mgr/conversations/messages';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';



/**
 * Triggered by document.create in 'messages/{phoneNumber}/platforms/{platform}/msgs/{messageId}'
 * Processes the message and returns the next block.
 */
export class ProcessMessageHandler extends FunctionHandler<Message, RestResult200>
{
  public async execute(req: Message, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[ProcessMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));

    // Initialize ChatBotStore
    const chatBotRepo$ =  new ChatBotStore(tools)

    //[WIP] - Get the current platform
    const platform = req.platform

    // Get the registered ChatInfo of the end-user
    const chatInfo  = await chatBotRepo$.chatInfo().getChatInfo(req.phoneNumber, platform);

    // Process the message
    await this._processMessage(chatInfo, req, tools, platform)

    return { success: true} as RestResult200
  }

  /**
   * Checks whether the chat is new and either initializes a new chat or resolves the next block
   * @param chatInfo - The registered chat information of the end-user
   * @param msg - The message sent by the end-user
   * @param platform - The platform we have received the message from
   * @returns First Block
   */
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
      return await this._resolveNextBlock(chatInfo, chatBotRepo$, msg, tools, platform)
    }
  }

  /** 
   * If a chat session has not yet been recorded, we create a new one and return the first block
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
   * @param chatInfo - The registered chat information of the end-user
   * @param chatBotRepo$ - Contains ready to use methods for working with the chatbot firebase collections
   * @param msg - The message sent by the end-user
   * @returns Next Block
   */
  private async _resolveNextBlock(chatInfo: ChatInfo, chatBotRepo$: ChatBotStore, msg: Message, tools: HandlerTools, platform: Platforms){
    // const chatService =  new ChatBotService(tools.Logger, platform)

    // Get the latest activity / latest position of the cursor
    const latestActivity = await chatBotRepo$.cursor().getLatestActivity(chatInfo, platform)

    // Get the lastest block found in activity
    const latestBlock = await chatBotRepo$.blockConnections().getBlockById(latestActivity.block.id, chatInfo)

    // Use NextBlockFactory to resolve the block type and get the next block based on the type
    const nextBlockService = new NextBlockFactory().resoveBlockType(latestBlock.type, tools)
    const nextBlock = await nextBlockService.getNextBlock(chatInfo, msg.message, latestBlock)

    // Handles possible race condition
    // const duplicateMessage = await chatService.handleDuplicates(msg, tools)

    // Update the cursor
    const cursor = await chatBotRepo$.cursor().moveCursor(chatInfo, nextBlock, platform)

    return cursor.block;

  }

}
