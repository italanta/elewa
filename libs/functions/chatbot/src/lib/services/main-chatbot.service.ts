import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';

import { Block, ChatBotStore, ChatStatus, DefaultBlock, EndUser } from './chatbot.store';


/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotService {

  chatId: string;
  constructor(private _logger: Logger) {}

  async init(user: EndUser, tools: HandlerTools): Promise<Block> {
    this._logger.log(()=> `[ChatBotService].init - Initializing Chat`)
    const chatBotRepo$ =  new ChatBotStore(tools)
    // Get the default block
    const defaultBlock: DefaultBlock = await chatBotRepo$.getDefaultBlock(user);

    // Get the next block using the default block
    const nextBlock: Block = await chatBotRepo$.getNextBlockFromDefault(user, defaultBlock);
    const chatData = await chatBotRepo$.initChatStatus(user); 

    this.chatId = chatData.chatId;
    // Save User Activity
    await chatBotRepo$.updateCursor(user, nextBlock);

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
    
    await chatBotRepo$.updateCursor(user, newBlock);

    return newBlock
  }
}
