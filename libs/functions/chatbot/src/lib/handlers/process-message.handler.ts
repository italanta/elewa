import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { ChatBotService } from '../services/main-chatbot.service';
import { NextBlockFactory } from '../services/next-block/next-block.factory';
import { ChatBotStore } from '../stores/chatbot.store';

import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { Activity, Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Block, ChatInfo } from '@app/model/convs-mgr/conversations/chats';



/**
 * Triggered by document.create in 'messages/{phoneNumber}/platforms/{platform}/msgs/{messageId}'
 * Processes the message and returns the next block.
 */
export class ProcessMessageHandler extends FunctionHandler<BaseMessage, RestResult200>
{
  public async execute(req: BaseMessage, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[ProcessMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));

    // Process the message
    await this._processMessage(req, tools)

    return { success: true} as RestResult200
  }

  /**
   * Checks whether the chat is new and either initializes a new chat or resolves the next block
   * @param chatInfo - The registered chat information of the end-user
   * @param msg - The message sent by the end-user
   * @param platform - The platform we have received the message from
   * @returns First Block
   */
  private async _processMessage(msg: BaseMessage, tools: HandlerTools)
  {
    tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    const chatBotRepo$ =  new ChatBotStore(tools)

    const cursorRepo$ =  chatBotRepo$.cursor()


    const userActivity =  await cursorRepo$.getLatestCursor(msg);

    if(!userActivity){
      return await this._getFirstBlock(msg, tools)
    } else {
      return await this._resolveNextBlock(msg, chatBotRepo$, tools)
    }
  }

  /** 
   * If a chat session has not yet been recorded, we create a new one and return the first block
  */
  private async _getFirstBlock(msg: BaseMessage, tools: HandlerTools)
  {    
    const chatBotRepo$ =  new ChatBotStore(tools)

    const blockConnections = chatBotRepo$.blockConnections()

    /** Get the first Block */
    const connection = await blockConnections.getFirstConn(msg)

    let firstBlock: Block = await blockConnections.getBlockById(connection.targetId, msg)


    /** Update the cursor with the first block */
    await chatBotRepo$.cursor().updateCursor(msg, firstBlock);

    tools.Logger.log(()=> `[ChatBotService].init - Updated Cursor`)

    return firstBlock;
  }


  /**
   * Gets the next block and updates the cursor
   * @param chatInfo - The registered chat information of the end-user
   * @param chatBotRepo$ - Contains ready to use methods for working with the chatbot firebase collections
   * @param msg - The message sent by the end-user
   * @returns Next Block
   */
  private async _resolveNextBlock(msg: BaseMessage, chatBotRepo$: ChatBotStore, tools: HandlerTools){
    // const chatService =  new ChatBotService(tools.Logger, platform)

    // Get the latest activity / latest position of the cursor
    const latestActivity = (await chatBotRepo$.cursor().getLatestCursor(msg)) as Activity

    // Get the lastest block found in activity
    const latestBlock = await chatBotRepo$.blockConnections().getBlockById(latestActivity.block.id, msg)

    // Use NextBlockFactory to resolve the block type and get the next block based on the type
    const nextBlockService = new NextBlockFactory().resoveBlockType(latestBlock.type, tools)
    const nextBlock = await nextBlockService.getNextBlock(msg, latestBlock)

    // Handles possible race condition
    // const duplicateMessage = await chatService.handleDuplicates(msg, tools)

    // Update the cursor
    const cursor = await chatBotRepo$.cursor().updateCursor(msg, nextBlock)

    return cursor.block;

  }

}
