import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';
import { __DateFromStorage } from '@iote/time';

import { ChatBotStore } from '../stores/chatbot.store';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Block } from '@app/model/convs-mgr/conversations/chats';
import { ChatStatus, BaseMessage } from '@app/model/convs-mgr/conversations/messages';


/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotService {

  chatId: string;

  constructor(private _logger: Logger, private _platform: Platforms) {}

  /**
   * Initializes chat status and returns the first block
   * @param msg 
   * @param chatInfo 
   * @param tools 
   * @returns First Block
   */
  async init(msg: BaseMessage, tools: HandlerTools): Promise<Block> | null {
    this._logger.log(()=> `[ChatBotService].init - Initializing Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)

    const blockConnections = chatBotRepo$.blockConnections()

    /** Get the first Block */
    const connection = await blockConnections.getFirstConn(msg)

    let firstBlock: Block = await blockConnections.getBlockById(connection.targetId, msg)


    /** Update the cursor with the first block */
    await chatBotRepo$.cursor().updateCursor(msg, firstBlock);

    this._logger.log(()=> `[ChatBotService].init - Initialized Cursor`)

    return firstBlock;

  }

  async pause(msg: BaseMessage, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].pause - Pausing Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.chatStatus().updateChatStatus(msg, ChatStatus.Paused)
  }

  async resume(msg: BaseMessage, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].resume - Resuming Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.chatStatus().updateChatStatus(msg, ChatStatus.Running)
  }

  async end(msg: BaseMessage, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].end - Ending Session`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.chatStatus().updateChatStatus(msg, ChatStatus.Ended)
  }

  async jumpToBlock(blockId: string, msg: BaseMessage, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].Jump - Jumping to block ${blockId}`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    const newBlock = await chatBotRepo$.blockConnections().getBlockById(blockId, msg)
    
    await chatBotRepo$.cursor().updateCursor(msg, newBlock);

    return newBlock
  }

  /**
   * Handles possible race condition, checks if a new message was added while processing the current message
   * If a new message was added, then its possible another instance of the function is running
   * @param msg 
   * @param tools 
   */
  async handleDuplicates(msg: BaseMessage, tools: HandlerTools): Promise<boolean>{
    const chatBotRepo$ =  new ChatBotStore(tools)
    const latestMessage = await chatBotRepo$.messages().getLatestMessage(msg)

    const currentMsgStamp = __DateFromStorage(msg.createdOn).unix()
    const latestMsgStamp = __DateFromStorage(latestMessage.createdOn).unix()

    if(currentMsgStamp !=  latestMsgStamp){
      tools.Logger.log(()=> `[ProcessMessageHandler]._handleDuplicates: Another message has been added during this transaction`)
      return true
    } 
    return false
  }
}
