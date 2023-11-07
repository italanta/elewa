import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { ChannelDataService, EnrolledUserDataService } from "@app/functions/bot-engine";
import { CommunicationChannel, PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { JobTypes, ScheduledMessage, UsersFilters } from "@app/model/convs-mgr/functions";

import { ScheduleMessagesReq } from "./model/schedule-message-req";
import { getReceipientID } from "./utils/get-receive-id.util";
import { ScheduleRecurringJob } from "./utils/schedule-recurring-job.util";
import { ScheduleTask } from "./utils/schedule-onetime-job.util";
import { CreateSurveyPayload, CreateTemplateMessagePayload } from "./utils/create-payload.util";

export class ScheduleMessageTemplatesHandler extends FunctionHandler<ScheduleMessagesReq, any>
{
  async execute(cmd: ScheduleMessagesReq, context: FunctionContext, tools: HandlerTools) 
  {
    tools.Logger.log(() => `[ScheduleMessageTemplatesHandler].execute - Schedule Request: ${JSON.stringify(cmd)}`);

    try {
      const channelService = new ChannelDataService(tools);

      const communicationChannel = await channelService.getChannelInfo(cmd.channelId);

      const {endUsers, enrolledEndUserIds} = await this.__getEndUsers(cmd.usersFilters, communicationChannel.type, communicationChannel.orgId, tools);

      const scheduledMessage = {
        ...cmd,
        n: communicationChannel.n,
        plaform: communicationChannel.type,
        endUsers: endUsers,
        dispatchTime: new Date(cmd.dispatchTime)
      };

      let task: any;

      const payload = this._getPayload(cmd, communicationChannel, endUsers, enrolledEndUserIds);
      // Create job/task
      if(scheduledMessage.frequency) {
        task = await ScheduleRecurringJob(payload, scheduledMessage, tools);
      } else {
        task = await ScheduleTask(payload, scheduledMessage, tools);
      }
      
      // Save scheduled message
      await this._saveScheduledMessage(cmd, communicationChannel.orgId, tools);
      tools.Logger.log(() => `[ScheduleMessageTemplatesHandler].execute - Scheduled Message: ${JSON.stringify(scheduledMessage)}`);
      return { success: true, task } as any;
    } catch (error) {
      tools.Logger.log(() => `[ScheduleMessageTemplatesHandler].execute - Error Scheduling Message: ${error}`);
      return { success: false, error } as any;
    }
  }

  private _saveScheduledMessage(cmd: ScheduleMessagesReq, orgId: string, tools: HandlerTools)
  {
    const schedule = {
      ...cmd,
      successful: [],
      failed: []
    } as ScheduledMessage;

    const scheduledMessages$ = tools.getRepository<ScheduledMessage>(`orgs/${orgId}/scheduled-messages`);

    return scheduledMessages$.create(schedule);
  }

  private async __getEndUsers(usersFilters: UsersFilters, platform: PlatformType, orgId: string, tools: HandlerTools) 
  {
    let endUsers: string[] = [];

    const enrolledUserService = new EnrolledUserDataService(tools, orgId);

    const enrolledEndUsers = await enrolledUserService.getEnrolledUsers();

    const enrolledEndUserIds = enrolledEndUsers.map((user)=> user.id);

    // If there are no filters, send the message to all end users under that
    //  organisation
    if (!usersFilters) {
      endUsers =  enrolledEndUsers.map((user) => getReceipientID(user, platform));

      return {endUsers, enrolledEndUserIds};
    }

    // Get the receive ID of only the end users specified
    if (usersFilters.endUsersId) {
      const filteredEndUsers = enrolledEndUsers
          .filter((user) => usersFilters.endUsersId.includes(user.id))
          .map((user) => getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredEndUsers];
    }

    if (usersFilters.class) {
      const filteredByClass = enrolledEndUsers
        // TODO: Filter the array of classes
        .filter((user) => usersFilters.class.includes(user.classId))
        .map((user) => getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredByClass];
    }


    if (usersFilters.module) {
      const filteredByModule = enrolledEndUsers
        // TODO: Filter the array of classes
        .filter((user) => user.modules[0] == usersFilters.module)
        .map((user) => getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredByModule];
    }

    if (usersFilters.story) {
      const filteredByStory = enrolledEndUsers
        // TODO: Filter the array of classes
        .filter((user) => user.lessons[0] == usersFilters.story)
        .map((user) => getReceipientID(user, platform)) || [];

      endUsers = [...endUsers, ...filteredByStory];
    }

    return {endUsers, enrolledEndUserIds};
  }

  _getPayload(cmd: ScheduleMessagesReq, channel: CommunicationChannel, endusers: string[], enrolledEndUserIds: string[]) {
    switch (cmd.type) {
      case JobTypes.Survey:
        return CreateSurveyPayload(cmd, channel, enrolledEndUserIds);
      case JobTypes.SimpleMessage:
        return CreateTemplateMessagePayload(cmd, channel, endusers);
      default:
        return CreateTemplateMessagePayload(cmd, channel, endusers);
    }
  }
}