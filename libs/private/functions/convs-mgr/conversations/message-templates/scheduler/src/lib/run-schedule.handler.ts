import * as moment from 'moment';
import axios from "axios";

import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

/**
 * Since GCP Scheduler and cron do not support running a job/task every x number of
 *  weeks, we have to check first if the job is suppossed to run on the current
 *    week based on the first time the job was scheduled.
 * 
 * That is the purpose of this handler to handle such scenarios
 */
export class RunScheduleHandler extends FunctionHandler<{startDate: Date, payload: any, function: string, weeklyInterval?: number}, any>
{
  async execute(cmd: {startDate: Date, weeklyInterval: number, payload: any, function: string}, context: FunctionContext, tools: HandlerTools) 
  {
    tools.Logger.log(() => `[RunScheduleHandler].execute - Run Schedule Request: ${JSON.stringify(cmd)}`);

    try {
      // If not weekly interval, then just execute the request
      if(!cmd.weeklyInterval) {
        return this._httpPost(cmd.function, cmd.payload, tools);
      }

      // If this is the week, the job has been scheduled to run, 
      //    then execute the request.
      if(this._shouldRun(moment(cmd.startDate), cmd.weeklyInterval)) {
        return this._httpPost(cmd.function, cmd.payload, tools);
      } else {
        tools.Logger.log(() => `[RunScheduleHandler].execute - Not the week to run the task`);

        return { success: true };
      }
    } catch (error) {
      tools.Logger.log(() => `[RunScheduleHandler].execute - Error Running Schedule Request: ${error}`);
      return { success: false, error };
    }
  }

  /**
   * Since GCP Scheduler and cron do not support running a job/task every x number of
   *  weeks, we have to check first if the job is suppossed to run on the current
   *    week based on the first time the job was scheduled.
   * 
   * That is the purpose of this handler to handle such scenarios
   */
  private _shouldRun(startDate: moment.Moment, intervalWeeks: number): boolean {
    const currentDate = moment();
    const weeksSinceStart = currentDate.diff(startDate, 'weeks');
    return weeksSinceStart % intervalWeeks === 0;
}

  private async _httpPost(URL: string, payload: any, tools: HandlerTools) {

    tools.Logger.log(() => `[RunScheduleHandler].post - Attempting to post: ${JSON.stringify(payload)}`);
  
    const headers = {
      'ContentType': 'application/json'
    }
  
    const resp = await axios.post(URL, payload, {
      headers: headers
    });
  
    if (resp.status < 300) {
      tools.Logger.log(() => `[RunScheduleHandler].post - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.log(() => `[RunScheduleHandler].post - Post data Success: ${JSON.stringify(resp.data)}`);
      return resp.data;
    } else {
      tools.Logger.log(() => `[RunScheduleHandler].post - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.error(() =>
        `[RunScheduleHandler].httpPostRequest - Error while posting data: ${JSON.stringify(resp.data)}`);
    }
  }
}