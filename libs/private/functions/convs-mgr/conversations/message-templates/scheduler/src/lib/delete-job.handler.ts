import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import CloudSchedulerService from "./model/services/cloud-scheduler.service";

export class DeleteJobHandler extends FunctionHandler<{jobName: string}, any>
{
  async execute(cmd: {jobName: string}, context: FunctionContext, tools: HandlerTools) 
  {
    tools.Logger.log(() => `[DeleteJobHandler].execute - Delete Request: ${JSON.stringify(cmd)}`);
    const schedulerService = new CloudSchedulerService(tools);

    try {
      const resp = await schedulerService.deleteJob(cmd.jobName);
      
      return { success: true, resp };
    } catch (error) {
      tools.Logger.log(() => `[DeleteJobHandler].execute - Error Deleting Task: ${error}`);
      return { success: false, error };
    }
  }
}