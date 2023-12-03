import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { ScheduleOptions } from "@app/model/convs-mgr/functions";
import { ChannelDataService } from "@app/functions/bot-engine";

import CloudSchedulerService from "./model/services/cloud-scheduler.service";
import { SetInacivityReq } from "./model/set-inactivity-req";

/**
 * Handler that creates a periodical job to check for user inactivity
 */
export class SetInactivityHandler extends FunctionHandler<SetInacivityReq, any>
{
  async execute(cmd: SetInacivityReq, context: FunctionContext, tools: HandlerTools) 
  {
    tools.Logger.log(() => `[SetInactivityHandler].execute - Request: ${JSON.stringify(cmd)}`);
    const schedulerService = new CloudSchedulerService(tools);

    const minTime = 23;

    // Ensures the minimum time to repeat is 23 hours
    const recurringTime = Math.max(minTime, cmd.inactivityTime);

    try {
      const channelService = new ChannelDataService(tools);

      const communicationChannel = await channelService.getChannelInfo(cmd.channelId);
      
      const scheduleOptions: ScheduleOptions = {
        ...cmd,
        dispatchTime: new Date(),
        frequency: `every ${recurringTime} hours`
      }

      const schedulePayload = {
        functionName: 'checkInactivity',
        channel: communicationChannel,
        scheduleOptions,
        message: cmd.message
      }

     const task = await schedulerService.scheduleRecurringJob(schedulePayload, scheduleOptions);

     // TODO: Save this inactivity config to DB under scheduled-messages
      
    return { success: true, task };
    } catch (error) {
      tools.Logger.log(() => `[SetInactivityHandler].execute - Error Creating Task: ${error}`);
      return { success: false, error };
    }
  }
}