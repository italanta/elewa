import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';
import { __DateFromStorage } from '@iote/time';

import { ChatBotStore } from '../stores/chatbot.store';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { ChatInfo, Block } from '@app/model/convs-mgr/conversations/chats';
import { ChatStatus, Message } from '@app/model/convs-mgr/conversations/messages';


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
  async init(msg: Message, chatInfo: ChatInfo, tools: HandlerTools): Promise<Block> | null {
    this._logger.log(()=> `[ChatBotService].init - Initializing Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)

    const blockConnections = chatBotRepo$.blockConnections()
    const chatStatus = chatBotRepo$.chatStatus()

    /** Initialize Chat Status */
    const chatData = await chatStatus.initChatStatus(chatInfo, this._platform); 
    this._logger.log(()=> `[ChatBotService].init - Initialized Chat Status`)

    // Set the Chat Id
    this.chatId = chatData.chatId;

    /** Get the first Block */
    const connection = await blockConnections.getFirstConn(chatInfo.storyId, chatInfo)

    let firstBlock: Block = await blockConnections.getBlockById(connection.targetId, chatInfo)


    /** Update the cursor with the first block */
    await chatBotRepo$.cursor().moveCursor(chatInfo, firstBlock, this._platform);

    this._logger.log(()=> `[ChatBotService].init - Initialized Cursor`)

    return firstBlock;

  }

  async pause(chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].pause - Pausing Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.chatStatus().updateChatStatus(chatInfo, ChatStatus.Paused, this._platform)
  }

  async resume(chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].resume - Resuming Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.chatStatus().updateChatStatus(chatInfo, ChatStatus.Running, this._platform)
  }

  async end(chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].end - Ending Session`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.chatStatus().updateChatStatus(chatInfo, ChatStatus.Ended, this._platform)
  }

  async jumpToBlock(blockId: string, chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].Jump - Jumping to block ${blockId}`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    const newBlock = await chatBotRepo$.blockConnections().getBlockById(blockId, chatInfo)
    
    await chatBotRepo$.cursor().moveCursor(chatInfo, newBlock, this._platform);

    return newBlock
  }

  /**
   * Handles possible race condition, checks if a new message was added while processing the current message
   * If a new message was added, then its possible another instance of the function is running
   * @param msg 
   * @param tools 
   */
  async handleDuplicates(msg: Message, tools: HandlerTools): Promise<boolean>{
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
