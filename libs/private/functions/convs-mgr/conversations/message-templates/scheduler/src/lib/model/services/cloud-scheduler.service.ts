import { CloudSchedulerClient } from '@google-cloud/scheduler';
import { Timestamp } from '@firebase/firestore-types';

import { HandlerTools } from '@iote/cqrs';

import { ScheduleOptions } from '@app/model/convs-mgr/functions';

import { GcpTask } from '../../model/gcp/gcp-task.interface';
import { GcpJob, HttpMethodTypes } from '../../model/gcp/gcp-job.interface';
import { ModifyCronString } from '../../utils/modify-custom-cron.util';

class CloudSchedulerService
{
  private cloudSchedulerClient: CloudSchedulerClient;
  private tools: HandlerTools;
  private projectId: string;

  private locationId = 'europe-west1';

  constructor(tools: HandlerTools, projectId: string = process.env.GCLOUD_PROJECT)
  {
    this.cloudSchedulerClient = new CloudSchedulerClient();
    this.tools = tools;
    this.projectId = projectId;
  }

  private get jobPath(): string
  {
    return `projects/${this.projectId}/locations/${this.locationId}/jobs/`;
  }

  private generateJob(payload: any, options: ScheduleOptions, jobName: string, endpoint: string): GcpTask
  {
    const dispatchTimeSeconds = Math.floor(options.dispatchTime.getTime() / 1000);
    const dispatchTimeNanos = (options.dispatchTime.getTime() / 1000 - dispatchTimeSeconds) * 1000000;
    
     // Check if the job has been scheduled to run x number of weeks, and modify the cron format
    const [modifiedCron, extractedNumber] = ModifyCronString(options.frequency);
    
    const runSchedulePayload = {
      payload: { data: { ...payload }},
      function: endpoint,
      startDate: options.dispatchTime,
      weeklyInterval: null,
    }
    
    if(extractedNumber) {
      runSchedulePayload.weeklyInterval = extractedNumber
    }
    
    const body = JSON.stringify(runSchedulePayload);

    const task: GcpJob = {
      name: jobName,
      httpTarget: {
        uri: this.runScheduleEndpoint(),
        body: Buffer.from(body).toString("base64"),
        httpMethod: HttpMethodTypes.POST,
        headers: { 'Content-Type': 'application/json' },
      },
      schedule: modifiedCron,
      scheduleTime: {
        seconds: dispatchTimeSeconds,
        nanoseconds: dispatchTimeNanos,
      } as Timestamp,
    };

    return task;
  }

  private getJobName(options: ScheduleOptions, name: string): string
  {
    const jobId = `${name}_${options.dispatchTime.getTime()}_${Date.now()}`;

    return this.jobPath + jobId;
  }

  private getEndpoint(functionName: string): string
  {
    return `https://${this.locationId}-${this.projectId}.cloudfunctions.net/${functionName}`;
  }
  
  private runScheduleEndpoint(): string 
  {
    return `https://${this.locationId}-${this.projectId}.cloudfunctions.net/runSchedule`;
  }

  public async scheduleRecurringJob(payload: any, options: ScheduleOptions): Promise<any>
  {
    const endpoint = this.getEndpoint(payload.functionName);
    const jobName = this.getJobName(options, options.objectID);
    const job = this.generateJob(payload, options, jobName, endpoint);

    const request = { parent: `projects/${this.projectId}/locations/${this.locationId}`, job };

    const [response] = await this.cloudSchedulerClient.createJob(request);

    this.tools.Logger.log(() => `[ScheduleMessage]- ${JSON.stringify(response)}`);

    return response;
  }

  public async deleteJob(jobName: string): Promise<any>
  {
    const request = { name: jobName };

    const [response] = await this.cloudSchedulerClient.deleteJob(request);

    this.tools.Logger.log(() => `[ScheduleMessage].Delete Job - ${JSON.stringify(response)}`);

    return response;
  }
}

export default CloudSchedulerService;
