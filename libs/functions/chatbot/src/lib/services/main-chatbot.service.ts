import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';

import { Block, ChatBotStore, ChatInfo, ChatStatus, DefaultBlock, EndUser } from './chatbot.store';


/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotService {

  chatId: string;

  constructor(private _logger: Logger, private _platform: Platforms) {}

  async init(chatInfo: ChatInfo, tools: HandlerTools): Promise<Block> {
    this._logger.log(()=> `[ChatBotService].init - Initializing Chat`)
    const chatBotRepo$ =  new ChatBotStore(tools)
    // Get the default block
    const defaultBlock: DefaultBlock = await chatBotRepo$.getDefaultBlock(chatInfo);

    // Get the next block using the default block
    const nextBlock: Block = await chatBotRepo$.getNextBlockFromDefault(chatInfo, defaultBlock);
    const chatData = await chatBotRepo$.initChatStatus(chatInfo, this._platform); 

    this.chatId = chatData.chatId;
    // Save User Activity
    await chatBotRepo$.updateCursor(chatInfo, nextBlock, this._platform);

    return nextBlock;
  }

  async pause(user: EndUser, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].pause - Pausing Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.updateChatStatus(user, ChatStatus.Paused)
  }

  async resume(user: EndUser, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].resume - Resuming Chat`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.updateChatStatus(user, ChatStatus.Running)
  }

  async end(user: EndUser, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].end - Ending Session`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    await chatBotRepo$.updateChatStatus(user, ChatStatus.Ended)
  }

  async jumpToBlock(blockId: string, user: EndUser, tools: HandlerTools){
    this._logger.log(()=> `[ChatBotService].Jump - Jumping to block ${blockId}`)

    const chatBotRepo$ =  new ChatBotStore(tools)
    const newBlock = await chatBotRepo$.getBlockById(blockId, user)
    
    await chatBotRepo$.updateCursor(user, newBlock, this._platform);

    return newBlock
  }
}
