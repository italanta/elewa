import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { ProcessMessageService } from '../services/process-message/process-message.service';
import { CursorDataService } from '../services/data-services/cursor.service';
import { ConnectionsDataService } from '../services/data-services/connections.service';
import { BlockDataService } from '../services/data-services/blocks.service';

import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';



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

    // Create an instance of the process message service
    const nextBlock = await this._processMessage(req, tools)
    
    //TODO: Call the send message handler

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

    // TODO: Create a DI container to manage instances and dynamically inject dependencies
    const connDataService  = new ConnectionsDataService(msg, tools)
    const cursorDataService = new CursorDataService(msg, tools)
    const blockDataService = new BlockDataService(msg, connDataService, tools)

    // Pass dependencies to the Process Message Service
    const processMessage = new ProcessMessageService(cursorDataService,connDataService, blockDataService)

    tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    const userActivity =  await cursorDataService.getLatestCursor();

    if(!userActivity){
      return await processMessage.getFirstBlock(tools)
    } else {
      return await processMessage.resolveNextBlock(msg, tools)
    }
  }


}
