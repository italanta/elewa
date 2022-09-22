import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { ChatInfo, Block, DefaultBlock } from '@app/model/convs-mgr/conversations/chats';
import { ChatStatus } from '@app/model/convs-mgr/conversations/messages';
import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';

import { ChatBotStore } from './chatbot.store';


/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotService {

  chatId: string;

  constructor(private _logger: Logger, private _platform: Platforms) {}

  async init(chatInfo: ChatInfo, tools: HandlerTools): Promise<Block> {
    this._logger.log(()=> `[ChatBotService].init - Initializing Chat`)
    const chatBotRepo$ =  new ChatBotStore(tools)

    // Get the first block using the anchor block - which uses the story id

    // Get the first connection
    const connection = await chatBotRepo$.getFirstConn(chatInfo.storyId, chatInfo)

    // Use the connection.targetId, to get the data of the first block
    let firstBlock: Block = await chatBotRepo$.getBlockById(connection.targetId, chatInfo)

    const chatData = await chatBotRepo$.initChatStatus(chatInfo, this._platform); 
    this._logger.log(()=> `[ChatBotService].init - Initialized Chat Status`)
    this.chatId = chatData.chatId;
    // Save User Activity
    await chatBotRepo$.moveCursor(chatInfo, firstBlock, this._platform);
    this._logger.log(()=> `[ChatBotService].init - Initialized Cursor`)
    return firstBlock;
  }

  async pause(chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].pause - Pausing Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.updateChatStatus(chatInfo, ChatStatus.Paused, this._platform)
  }

  async resume(chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].resume - Resuming Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.updateChatStatus(chatInfo, ChatStatus.Running, this._platform)
  }

  async end(chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].end - Ending Session`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.updateChatStatus(chatInfo, ChatStatus.Ended, this._platform)
  }

  async jumpToBlock(blockId: string, chatInfo: ChatInfo, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].Jump - Jumping to block ${blockId}`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    const newBlock = await chatBotRepo$.getBlockById(blockId, chatInfo)
    
    await chatBotRepo$.moveCursor(chatInfo, newBlock, this._platform);

    return newBlock
  }
}
