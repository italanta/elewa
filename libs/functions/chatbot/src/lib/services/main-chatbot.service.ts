import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/cqrs';

import { Block, ChatBotStore, DefaultBlock, EndUser } from './chatbot.store';


/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotService {

  constructor(private _logger: Logger) {}

  async init(user: EndUser, tools: HandlerTools): Promise<Block> {
    this._logger.log(()=> `[ChatBotService].init - Initializing Chat`)
    const chatBotRepo$ =  new ChatBotStore(tools)
    // Get the default block
    const defaultBlock: DefaultBlock = await chatBotRepo$.getDefaultBlock(user);

    // Get the next block using the default block
    const nextBlock: Block = await chatBotRepo$.getNextBlockFromDefault(user, defaultBlock);

    // Save User Activity
    await chatBotRepo$.updateActivity(user, defaultBlock);

    return nextBlock;
  }

}
