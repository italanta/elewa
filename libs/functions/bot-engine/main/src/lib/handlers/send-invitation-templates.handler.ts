import { WhatsappActiveChannel } from '@app/functions/bot-engine/whatsapp';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { HandlerTools } from '@iote/cqrs';
import { __DateFromStorage } from '@iote/time';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';
import { ChannelDataService } from '../services/data-services/channel-info.service';

export class SendInvitationMessages extends FunctionHandler<{n: number, phoneNumbers: string[]}, RestResult | any>
{
  orgId: string = 'yXyu2Rn5FJbwfZVAl6w6agHNW4I2';
  public async execute(req: {n: number, phoneNumbers: string[]}, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      // Get communication channel

      const channelDataService = new ChannelDataService(tools)

      const communicationChannel = await channelDataService.getChannelByConnection(req.n);

      if(!communicationChannel){ 
        return { error: 'Channel not found', status: 500} as RestResult
      }

      const whatsappActiveChannel = new WhatsappActiveChannel(tools, communicationChannel as CommunicationChannel); 

      const userNumbers =  req.phoneNumbers;

      let count = 0;
      for(const phoneNumber of userNumbers) {
  
          let outgoingMessage;

          outgoingMessage = whatsappActiveChannel.parseOutTemplateMessage(invitationTemplateName, phoneNumber);
          await whatsappActiveChannel.send(outgoingMessage);

          count += 1;

        tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent message to ${phoneNumber}`);
      }

      tools.Logger.log(() => `[MilestonesTrackerHandler].execute - Sent message to ${count} users`);
    } catch (error) {
      tools.Logger.error(() => `[MilestonesTrackerHandler].execute - Encountered an error ${error}`);

      return { error: error.message, status: 500} as RestResult
    }
  }
}

const invitationTemplateName = "enabel_elearning_invitation";
