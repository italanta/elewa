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
}
