import { HandlerTools } from '@iote/cqrs';

import { ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { FunctionHandler, RestResult200, FunctionContext } from '@ngfi/functions';
import { EndUserDataService } from '../services/data-services/end-user.service';

export class TalkToHumanHandler extends FunctionHandler<{ id: string, name?: string, isGlitch?: number }, RestResult200>
{
  endUserService: EndUserDataService;
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: { id: string, name?: string, agentId?: string, isGlitch?: number }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[TalkToHumanHandler].execute: Open up channel to talk to Human Agent.`);
    tools.Logger.log(() => JSON.stringify(req));

    this.endUserService = new EndUserDataService(tools, req.agentId);

    await this._pauseBot(req.id);
    // const chatRepo = tools.getRepository<Chat>(`sessions`);
    // const chat = await chatRepo.getDocumentById(CHAT_ID(req.id));

    // if(chat)
    // {
    //   if(req.agentId || this._checkTime())
    //   {
    //     await landbot.setOnline();

    //     await landbot.assignToAgent(CHAT_ID(req.id));

    //     if(!req.isGlitch)
    //     {
    //       await this._prepareUser(req, landbot, tools);
    //     }

    //     await this._updateChatFlow(req, tools, chat);

    //     /** TODO: Assign chat to next available agent. assignToAgent()*/
    //   }
    //   else
    //   {
    //     await this._addToWaitList(req, tools, chat);

    //     const blockRef = this._getNoAgentsBlockRef(req.name);
    //     await landbot.resumeChat(req.id, WHATSAPP_BOT_ID, blockRef);
    //   }

    //   await chatRepo.update(chat);
    // }
    // else
    // {
    //   tools.Logger.log(() => `[TalkToHumanHandler].execute: Invalid chatId: ${req.id} provided.`);
    // }

    return { success: true } as RestResult200;
  }

  // Pause the chat
  private async _pauseBot(endUserId: string) {
   const endUser = await this.endUserService.getEndUser(endUserId);

    if (endUser) {
      endUser.status = ChatStatus.PausedByAgent;
      return this.endUserService.updateEndUser(endUser);
    }
  }

  // private async _prepareUser(req: { id: string, name?: string, agentId?: string }, : LandbotService, tools?: HandlerTools)
  // {
  //   if(req.agentId)
  //   {
  //     const userRepo = tools.getRepository<User>('users');
  //     const agent = await userRepo.getDocumentById(req.agentId);

  //     await landbot.sendMessage(req.id, 'A trainer has requested to talk to you. Your chat has now been paused.');
  //     if(agent)
  //     {
  //       await landbot.sendMessage(req.id, `You are now speaking with ${ agent.displayName }`);
  //     }
  //     await this._pauseBot(req.id);
  //   }
  //   else
  //   {
  //     await landbot.sendMessage(req.id, 'Give me a minute while I look for the next available agent.');
  //     await landbot.sendMessage(req.id, 'Our agents typically reply within 5 minutes.');
  //   }
  // }
}
