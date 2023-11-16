import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { ChannelDataService, EnrolledUserDataService } from "@app/functions/bot-engine";
import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { ScheduledMessage } from "@app/model/convs-mgr/functions";

import { ScheduleMessagesReq } from "./model/schedule-message-req";
import CloudSchedulerService from "./model/services/cloud-scheduler.service";
import CloudTasksService from "./model/services/cloud-task.service";
import { _getPayload } from "./utils/create-payload.util";

export class ScheduleMessageTemplatesHandler extends FunctionHandler<ScheduleMessagesReq, any>
{
  async execute(cmd: ScheduleMessagesReq, context: FunctionContext, tools: HandlerTools) 
  {
    tools.Logger.log(() => `[ScheduleMessageTemplatesHandler].execute - Schedule Request: ${JSON.stringify(cmd)}`);
    const schedulerService = new CloudSchedulerService(tools);
    const cloudTaskService = new CloudTasksService(tools);

    let task: any;
    
    try {
      const channelService = new ChannelDataService(tools);

      const communicationChannel = await channelService.getChannelInfo(cmd.channelId);

      const endUserIds = await this.__getEndUsers(communicationChannel.type, communicationChannel.orgId, tools);

      const scheduledMessage = {
        ...cmd,
        n: communicationChannel.n,
        plaform: communicationChannel.type,
        endUserIds: endUserIds,
        dispatchTime: new Date(cmd.dispatchTime),
        endDate: cmd.endDate ? new Date(cmd.endDate) : null
      };

      const payload = _getPayload(cmd, communicationChannel, endUserIds, cmd.message);

      // If frequency is specified, then it is a recurring job
      if (scheduledMessage.frequency) {

        task = await schedulerService.scheduleRecurringJob(payload, scheduledMessage);

        // If the recurring job has an endDate, schedule a cloud task to delete the job on that date
        if (scheduledMessage.endDate) {
          await cloudTaskService.scheduleDeleteTask({ jobName: task.name }, cmd);

        }
      } else {
        task = await cloudTaskService.scheduleTask(payload, scheduledMessage);
      }

      // Save scheduled message
      await this._saveScheduledMessage(cmd, task, communicationChannel.orgId, tools);
      tools.Logger.log(() => `[ScheduleMessageTemplatesHandler].execute - Scheduled Message: ${JSON.stringify(scheduledMessage)}`);
      return { success: true, task } as any;
    } catch (error) {
      tools.Logger.log(() => `[ScheduleMessageTemplatesHandler].execute - Error Scheduling Message: ${error}`);
      return { success: false, error } as any;
    }
  }

  private _saveScheduledMessage(cmd: ScheduleMessagesReq, task: any, orgId: string, tools: HandlerTools)
  {
    const schedule = {
      ...cmd,
      successful: [],
      failed: [],
      jobID: task.name,
    } as ScheduledMessage;

    const scheduledMessages$ = tools.getRepository<ScheduledMessage>(`orgs/${orgId}/scheduled-messages`);

    return scheduledMessages$.create(schedule);
  }

  private async __getEndUsers(platform: PlatformType, orgId: string, tools: HandlerTools) 
  {
    const enrolledUserService = new EnrolledUserDataService(tools, orgId);

    const enrolledEndUsers = await enrolledUserService.getEnrolledUsers();

    const endUsersIds = enrolledEndUsers.filter((user)=> user.platformDetails).map((user) => user.platformDetails[platform].endUserId);

    return endUsersIds;
  }
}