import { HandlerTools } from '@iote/cqrs';


import { User } from '@iote/bricks';
import { Chat, CHAT_ID, ChatFlowStatus } from '@app/model/convs-mgr/conversations/chats';
import { FunctionHandler, RestResult200, FunctionContext } from '@ngfi/functions';
import { BotEnginePlay } from '../services/bot-engine-play.service';

const WHATSAPP_BOT_ID = 644268;
const CHAT_WAITING_BLOCK_REFERENCE = 'Bkcd41ee6->Nkfhxwrs4';

//Continuation Block Refs
const CONTINUATION_ID_BEFORE_PURCHASE = 'Bkcd41ee6->brick_start';
const CONTINUATION_ID_BEFORE_LEARNING_BY_DOING = 'Bkcd6dit6->Bkcd6dikq->Bkcd6dicc->Bkcd6di74->Nkbg8lltq';
const CONTINUATION_ID_AFTER_AREA_STRUCTURE = 'Bkcd8662t->Nkebcj2dc';

//No Agents Block Refs
const AGENT_UNAVAILABLE_ID_BEFORE_PURCHASE = 'Bkf6krntz->Nkf6kuhmq';
const AGENT_UNAVAILABLE_ID_BEFORE_LEARNING_BY_DOING = 'Bkcd6dit6->Bkcd6dikq->Bkcd6dicc->Bkcd6di74->Bkf6mskom->Nkf6kuhmq';
const AGENT_UNAVAILABLE_ID_AFTER_AREA_STRUCTURE = 'Bkcd8662t->Bkf6nefvk->Nkf6kuhmq ';

export class TalkToHumanHandler extends FunctionHandler<{ id: string, name?: string, isGlitch?: number }, RestResult200>
{
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: { id: string, name?: string, agentId?: string, isGlitch?: number }, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[TalkToHumanHandler].execute: Open up channel to talk to Human Agent.`);
    tools.Logger.log(() => JSON.stringify(req));

    const bot = new BotEnginePlay(tools.Logger);

    const chatRepo = tools.getRepository<Chat>(`sessions`);
    const chat = await chatRepo.getDocumentById(CHAT_ID(req.id));

    if(chat)
    {
      if(req.agentId || this._checkTime())
      {
        await landbot.setOnline();

        await landbot.assignToAgent(CHAT_ID(req.id));

        if(!req.isGlitch)
        {
          await this._prepareUser(req, landbot, tools);
        }

        await this._updateChatFlow(req, tools, chat);

        /** TODO: Assign chat to next available agent. assignToAgent()*/
      }
      else
      {
        await this._addToWaitList(req, tools, chat);

        const blockRef = this._getNoAgentsBlockRef(req.name);
        await landbot.resumeChat(req.id, WHATSAPP_BOT_ID, blockRef);
      }

      await chatRepo.update(chat);
    }
    else
    {
      tools.Logger.log(() => `[TalkToHumanHandler].execute: Invalid chatId: ${req.id} provided.`);
    }

    return { success: true } as RestResult200;
  }

  // Add chat to list of those that need to be contacted
  private async _addToWaitList(req: { id: string, name?: string, agentId?: string }, tools: HandlerTools, chat: Chat)
  {
    chat.flow = ChatFlowStatus.OnWaitlist;
    chat.pause = {blockRef: this._getContinuationBlockRef(req.name)}
    chat.awaitingResponse = true;
  }

  private async _updateChatFlow(req: { id: string, name?: string, agentId?: string }, tools: HandlerTools, chat: Chat)
  {
    if(req.agentId){
      chat.flow = ChatFlowStatus.PausedByAgent;
      chat.instructors = [];
      chat.instructors.push(req.agentId);
    }
    else{
      chat.flow = ChatFlowStatus.Paused;
      chat.pause = {blockRef: this._getContinuationBlockRef(req.name)}
      chat.awaitingResponse = true;
    }
  }

  private async _prepareUser(req: { id: string, name?: string, agentId?: string }, landbot: LandbotService, tools?: HandlerTools)
  {
    if(req.agentId)
    {
      const userRepo = tools.getRepository<User>('users');
      const agent = await userRepo.getDocumentById(req.agentId);

      await landbot.sendMessage(req.id, 'A trainer has requested to talk to you. Your chat has now been paused.');
      if(agent)
      {
        await landbot.sendMessage(req.id, `You are now speaking with ${ agent.displayName }`);
      }
      await landbot.pauseBot(req.id);
    }
    else
    {
      await landbot.sendMessage(req.id, 'Give me a minute while I look for the next available agent.');
      await landbot.sendMessage(req.id, 'Our agents typically reply within 5 minutes.');
    }
  }

  //Check that enquiry is within working hours
  private _checkTime()
  {
    //TODO: Add a better timezone implementation.

    const start =  5 * 60 + 0; // 8am-5pm: Date() uses UTC time which is 3 hrs behind Kenyan time
    const end   = 14 * 60 + 0;

    const now = new Date();
    const time = now.getHours() * 60 + now.getMinutes();

    //Check if day is on a weekend
    if(now.getDay() === 6 || now.getDay() === 0)
    {
      return false;
    }

    return  time >= start && time < end;
  }

  //Set the block that comes after the conversation with the agent
  private _getContinuationBlockRef(name: string)
  {
    switch(name)
    {
      case 'before_learning_by_doing':
        return CONTINUATION_ID_BEFORE_LEARNING_BY_DOING;
      case 'after_area_structure':
        return CONTINUATION_ID_AFTER_AREA_STRUCTURE;
      case 'before_purchase':
        return CONTINUATION_ID_BEFORE_PURCHASE;
    }
  }

  //Set the block that comes when there's no available agent
  private _getNoAgentsBlockRef(name: string)
  {
    switch(name)
    {
      case 'before_learning_by_doing':
        return AGENT_UNAVAILABLE_ID_BEFORE_LEARNING_BY_DOING;
      case 'after_area_structure':
        return AGENT_UNAVAILABLE_ID_AFTER_AREA_STRUCTURE;
      case 'before_purchase':
        return AGENT_UNAVAILABLE_ID_BEFORE_PURCHASE;
    }
  }
}
