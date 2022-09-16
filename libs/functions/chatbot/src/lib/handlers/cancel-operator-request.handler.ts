import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { LandbotService } from '../services/main-chatbot.service';
import { Chat, ChatFlowStatus, CHAT_ID } from '@app/model/convs-mgr/conversations/chats';


const WHATSAPP_BOT_ID = 644268;
const DEFAULT_START_BLOCK = 'Bkcd6dit6->brick_start';

/**
 * Cancel Help Request Handler.  Cancels a pending help request 
 * and redirects trainee back to pause block 
 *
 * @param req - Chat info 
 *
 * */

export class CancelOperatorRequestHandler extends FunctionHandler<{ chatId: string }, RestResult200>
{
  public async execute(req: { chatId: string }, context: FunctionContext, tools: HandlerTools): Promise<any> {
    tools.Logger.log(() => `[CancelHelpRequestHandler].execute: Open up channel to talk to Human Agent.`);
    tools.Logger.log(() => JSON.stringify(req));
    
    const landbot = new LandbotService(tools.Logger);  
    
    const chatRepo = tools.getRepository<Chat>(`sessions`);
    const chat = await chatRepo.getDocumentById(CHAT_ID(req.chatId));

    if(chat) 
    {
      chat.awaitingResponse = false;
      chat.flow = ChatFlowStatus.Flowing;
      let blockRef;

      if(chat.pause?.blockRef)
      {
        blockRef = chat.pause.blockRef;
      }
      else
      {
        blockRef = DEFAULT_START_BLOCK;
      }

      await landbot.sendMessage(req.chatId, 'Your request has been cancelled. Enjoy the course! 😊');

      await landbot.resumeChat(req.chatId, WHATSAPP_BOT_ID, blockRef);
  
      await chatRepo.update(chat);
    }
    else
    {
      tools.Logger.log(() => `[CancelHelpRequestHandler].execute: Invalid chatId: ${ req.chatId } provided.`);
    }    
    return { success: true } as RestResult200;
  }

}