import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';
import { HandlerTools, Repository } from '@iote/cqrs';

import { Chat, ChatFlowStatus, ChatStatus, CHAT_ID } from '@app/model/convs-mgr/conversations/chats';
import { ChatBotService } from '@app/functions/chatbot';
import { User } from '@iote/bricks';

/** WhatsApp BOT Id - TODO: ENable different channels. */
const WHATSAPP_BOT_ID = 644268;
const DEFAULT_START_BLOCK = 'Bkcd6dit6->brick_start';
const DEFAULT_DORMANT_CHAT_BLOCK = 'Bkcd9airg->Nkfntq9ap';
const CHAT_WAITING_BLOCK_REFERENCE = 'Bkcd41ee6->Nkfhxwrs4';

export class AssignChatHandler extends FunctionHandler<{ chatId: string, action: 'resume' | 'jump'| 'stash', agentId?: string, blockReference?: string, stashReason?: string}, RestResult200>
{
  /**
   * Register User Handler. Records all onboarding information of a user
   *
   * @param req - Onboarding info */
  public async execute(req: { chatId: string, action: 'resume' | 'jump'| 'stash', agentId?: string, blockReference?: string, stashReason?: string }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => JSON.stringify(req));

    const chatRepo = tools.getRepository<Chat>('sessions');
    const chat = await chatRepo.getDocumentById(req.chatId);

    if(chat.flow === ChatFlowStatus.Completed)
    {
      await this._setDormant(req, tools, chat);
    }

    if(chat.flow === ChatFlowStatus.Paused || chat.flow === ChatFlowStatus.PausedByAgent)
    {
      switch(req.action){
        case 'resume':
          await this._resume(req, tools, chat);
          break;
        case 'jump':
          await this._jump(req, tools, chat);
          break;
        case 'stash':
          await this._stash(req, tools, chat, req.stashReason);
      }
    }
    else {
      this._unpausedChatError(chat);
    }

    chat.awaitingResponse = false;

    await chatRepo.update(chat);

    return { success: true } as RestResult200;
  }

  private async _setDormant(req: { chatId: string, action: 'resume' | 'jump' | 'stash', agentId?: string}, tools: HandlerTools, chat: Chat)
  {
    tools.Logger.log(() => `[AssignChatHandler]._setDormant(): Setting ${req.chatId} to dormant block.`);

    const landbot = new LandbotService(tools.Logger);

    await this._prepareUser(req.chatId, 'stash', landbot, chat, tools);

    const blockRef = chat.pause?.blockRef ? chat.pause.blockRef : DEFAULT_DORMANT_CHAT_BLOCK;

    await landbot.resumeChat(req.chatId, WHATSAPP_BOT_ID, blockRef);

    chat.instructors = [];
  }

  private async _resume(req: { chatId: string, action: 'resume' | 'jump' | 'stash', agentId?: string}, tools: HandlerTools, chat: Chat)
  {
    tools.Logger.log(() => `[AssignChatHandler].execute(resume): Exiting pause mode for chat ${req.chatId}.`);

    const landbot = new LandbotService(tools.Logger);

    await this._prepareUser(req.chatId, req.action, landbot, chat, tools);

    const blockRef = chat.pause?.blockRef ? chat.pause.blockRef : DEFAULT_START_BLOCK;

    await landbot.resumeChat(req.chatId, WHATSAPP_BOT_ID, blockRef);

    chat.flow = ChatFlowStatus.Flowing;
    chat.instructors = [];
    delete chat.pause;
  }

  private async _jump(req: { chatId: string, action: 'resume' | 'jump' | 'stash', agentId?: string, blockReference?: string}, tools: HandlerTools, chat: Chat)
  {
    tools.Logger.log(() => `[AssignChatHandler].execute(jump): Exiting pause mode for chat ${req.chatId}.`);

    const landbot = new LandbotService(tools.Logger);

    await this._prepareUser(req.chatId, req.action, landbot, chat, tools);

    if (!req.blockReference)
    {
      this._missingBlockRefError(chat);
    }
    else {
      await landbot.resumeChat(req.chatId, WHATSAPP_BOT_ID, req.blockReference);
      chat.flow = ChatFlowStatus.Flowing;
      chat.instructors = [];
    }
  }

  private async _stash(req: { chatId: string, action: 'resume' | 'jump' | 'stash', agentId?: string, blockReference?: string}, tools: HandlerTools, chat: Chat, reason: string)
  {
    tools.Logger.log(() => `[AssignChatHandler].execute(stash): Stashing chat ${req.chatId} by agendId ${req.agentId}.`);

    const landbot = new LandbotService(tools.Logger);

    await this._prepareUser(req.chatId, req.action, landbot, chat, tools);

    await landbot.resumeChat(req.chatId, WHATSAPP_BOT_ID, CHAT_WAITING_BLOCK_REFERENCE);

    chat.flow = ChatFlowStatus.Stashed;
    chat.status = ChatStatus.Stashed;
    chat.stashed = {reason: reason, stashedBy: req.agentId};
  }

  //Send messages to prepare user for the move
  private async _prepareUser(chatId: string, action: 'resume' | 'jump' | 'stash', landbot: LandbotService, chat: Chat, tools: HandlerTools)
  {
    switch(action){
      case 'jump':
        await landbot.sendMessage(chatId, 'The trainer is redirecting you to another section. Hang on..');
        await this._sendfeedbackBlock(chat, landbot, tools);
        break;
      case 'resume':
        await this._sendfeedbackBlock(chat, landbot, tools);
        break;
      case 'stash':
        await this._sendfeedbackBlock(chat, landbot, tools, false);
        break;
    }
  }

  private async _sendfeedbackBlock(chat: Chat, landbot: LandbotService, tools: HandlerTools, isContinuing: boolean = true)
  {
    //Message with name
    if(chat.instructors?.length > 0)
    {
      const instructorId = chat.instructors[chat.instructors?.length -1];
      tools.Logger.log(() => `[AssignChatHandler].sendFeedbackBlock: Fetching last instructor: Id ${instructorId}.`);
      const userRepo = tools.getRepository<User>('users');
      const lastInstructor = await userRepo.getDocumentById(instructorId);

      await landbot.sendMessage(chat.id, `We hope our trainer, ${lastInstructor.displayName}, has been of assistance. `);
    }
    else
    {
      await landbot.sendMessage(chat.id, 'We hope our trainer has been of assistance.');
    }

    //Feedback link
    await landbot.sendMessage(chat.id, "We'd be happy to receive your feedback on the following link: https://tinyurl.com/ksa-trainer-review");

    if(isContinuing)
    {
      await landbot.sendMessage(chat.id, 'Enjoy the course! 😊');
    }
    else
    {
      await landbot.sendMessage(chat.id, 'Hope to see you back again soon! 😊');
    }
  }

  private _unpausedChatError(chat: Chat)
  {
    chat.status = ChatStatus.Error;
    chat.error = {code: 'e_assign_chat_1',
                  message: 'Tried to resume a chat that is not paused.' };
  }

  private _missingBlockRefError(chat: Chat)
  {
    chat.status = ChatStatus.Error;
    chat.error = {code: 'e_assign_chat_1',
                  message: 'No blockReference was provided to jump to.' };
  }

}
