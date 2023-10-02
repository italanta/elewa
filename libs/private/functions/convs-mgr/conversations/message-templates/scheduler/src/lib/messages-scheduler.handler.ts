import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";


import { ChannelDataService, EnrolledUserDataService } from "@app/functions/bot-engine";
import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { ScheduledMessage, UsersFilters } from "@app/model/convs-mgr/functions";

import { ScheduleMessagesReq } from "./model/schedule-message-req";
import { ScheduleMessage } from "./utils/schedule-job.util";
import { getReceipientID } from "./utils/get-receive-id.util";

export class ScheduleMessageTemplatesHandler extends FunctionHandler<ScheduleMessagesReq, any>
{
  async execute(cmd: ScheduleMessagesReq, context: FunctionContext, tools: HandlerTools) 
  {

    const channelService = new ChannelDataService(tools);

    const communicationChannel = await channelService.getChannelInfo(cmd.channelId);

    const endUsers = await this.__getEndUsers(cmd.usersFilters, communicationChannel.type, communicationChannel.orgId, tools);

    const scheduledMessage: ScheduledMessage = {
      ...cmd,
      n: communicationChannel.n,
      plaform: communicationChannel.type,
      endUsers:endUsers,
      dispatchTime: cmd.dispatchTime
    };

    // Create job
    await ScheduleMessage(scheduledMessage, tools);

    // Save scheduled message
    await this._saveScheduledMessage(scheduledMessage, communicationChannel.orgId, tools);
  }

  private _saveScheduledMessage(schedule: ScheduledMessage, orgId: string, tools: HandlerTools)
  {
    const scheduledMessages$ = tools.getRepository<ScheduledMessage>(`orgs/${orgId}/scheduled-messages`);

    return scheduledMessages$.create(schedule);
  }

  private async __getEndUsers(usersFilters: UsersFilters, platform: PlatformType, orgId: string, tools: HandlerTools) 
  {
    let endUsers: string[] = [];

    const enrolledUserService = new EnrolledUserDataService(tools, orgId);

    const enrolledEndUsers = await enrolledUserService.getAllEnrolledUsers();

    if(usersFilters.class) {
      const filteredByClass = enrolledEndUsers
                  // TODO: Filter the array of classes
                  .filter((user)=> usersFilters.class.includes(user.classId))
                      .map((user)=> getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredByClass];
    } 

    if(usersFilters.endUsersId) {
      endUsers = [...endUsers, ...usersFilters.endUsersId];
    }

    if(usersFilters.module) {
      const filteredByModule = enrolledEndUsers
                  // TODO: Filter the array of classes
                  .filter((user)=> user.modules[0] == usersFilters.module)
                      .map((user)=> getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredByModule];
    }
    
    if(usersFilters.story) {
      const filteredByStory = enrolledEndUsers
                  // TODO: Filter the array of classes
                  .filter((user)=> user.lessons[0] == usersFilters.story)
                      .map((user)=> getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredByStory];
    }

    return endUsers;
  }
}