import { CloudTasksClient } from '@google-cloud/tasks';

import { Timestamp } from '@firebase/firestore-types';
import { HandlerTools } from '@iote/cqrs';

import { ScheduleOptions } from '@app/model/convs-mgr/functions';

import { GcpTask } from '../../model/gcp/gcp-task.interface';

class CloudTasksService
{
  private cloudTasksClient: CloudTasksClient;
  private tools: HandlerTools;
  private projectId: string;

  private locationId = 'europe-west1';

  constructor(tools: HandlerTools, projectId: string = process.env.GCLOUD_PROJECT)
  {
    this.cloudTasksClient = new CloudTasksClient();
    this.tools = tools;
    this.projectId = projectId;
  }

  private generateTask(payload: any, options: ScheduleOptions, taskName: string, endpoint: string): GcpTask
  {
    const body = JSON.stringify({ data: { ...payload } });
    const dispatchTime = options.dispatchTime;
    const seconds = Math.floor(dispatchTime.getTime() / 1000);
    const nanoseconds = (dispatchTime.getTime() - seconds * 1000) * 1000000;

    return {
      name: taskName,
      httpRequest: {
        url: endpoint,
        body: Buffer.from(body).toString("base64"),
        httpMethod: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      scheduleTime: { seconds, nanoseconds } as Timestamp,
    };
  }

  private getTaskName(path: string, time: Date, name: string): string
  {
    const taskId = `${name}-${time.getTime()}-${Date.now()}`;
    return path + '/tasks/' + taskId;
  }

  public async scheduleTask(payload: any, options: ScheduleOptions): Promise<any>
  {
    const endpoint = this.getEndpoint(payload.functionName);
    const taskName = this.getTaskName(this.queuePath('scheduled-messages'), options.dispatchTime, options.id);
    const task = this.generateTask(payload, options, taskName, endpoint);

    const request = { parent: this.queuePath('scheduled-messages'), task };

    const [response] = await this.cloudTasksClient.createTask(request);

    this.tools.Logger.log(() => `[ScheduleMessage]- ${JSON.stringify(response)}`);

    return response;
  }

  public async scheduleDeleteTask(payload: any, options: ScheduleOptions): Promise<any>
  {
    const endDate = new Date(options.endDate);
    const endpoint = this.getEndpoint('deleteJob');
    const taskName = this.getTaskName(this.queuePath('side-tasks'), endDate, options.id);
    
    options.dispatchTime =  endDate;
    const task = this.generateTask(payload, options, taskName, endpoint);

    const request = { parent: this.queuePath('side-tasks'), task };
    const [response] = await this.cloudTasksClient.createTask(request);

    this.tools.Logger.log(() => `[ScheduleMessage].Delete Job - ${JSON.stringify(response)}`);

    return response;
  }

  private queuePath(queueName: string): string
  {
    return `projects/${this.projectId}/locations/${this.locationId}/queues/${queueName}`;
  }

  private getEndpoint(functionName: string): string
  {
    return `https://${this.locationId}-${this.projectId}.cloudfunctions.net/${functionName}`;
  }
}

export default CloudTasksService;
