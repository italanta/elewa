import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel } from "../../model/active-channel.service";

import { EndUserDataService } from "../data-services/end-user.service";
import { ProcessMessageService } from "../process-message/process-message.service";

export class ChatCommandsManager 
{
  orgId: string;

  defaultStory: string;

  constructor(
    private _endUserDataService$: EndUserDataService,
    private _activeChannel: ActiveChannel,
    private _processMessageService$: ProcessMessageService,
    private _tools: HandlerTools) 
  {
    this.orgId = _activeChannel.channel.orgId;

    this.defaultStory = _activeChannel.channel.defaultStory;
  }

  parseCommand(msg: TextMessage, endUser: EndUser)
  {
    if (msg.text === '#init') {
      return this.__restartChat(endUser);
    }
  }

  private async __restartChat(endUser: EndUser)
  {
    const firstUserStory: EndUser = {
      ...endUser,
      currentStory: this.defaultStory
    };

    await this._endUserDataService$.updateEndUser(firstUserStory);

    return this._processMessageService$.getFirstBlock(this._tools, this.orgId, this.defaultStory);
  }
}