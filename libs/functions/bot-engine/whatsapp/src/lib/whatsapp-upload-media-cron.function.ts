import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { CloudSchedulerClient } from '@google-cloud/scheduler';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Bot } from '@app/model/convs-mgr/bots';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { GcpJob, HttpMethodTypes } from './models/gcp-job.interface';
import { WhatsappCronUpdateData } from './models/whatsapp-cron.interface';

/** Handler responsible for managing and creating whatspp app media update cron job when a bot is published */
export class WhatsappUploadMediaCronHandler extends FunctionHandler<WhatsappCronUpdateData, any> {
  private cloudSchedulerClient: CloudSchedulerClient;
  private projectId: string;
  private locationId = 'europe-west1';

  constructor() {
    super();
    this.cloudSchedulerClient = new CloudSchedulerClient();
  }

  public async execute(data: WhatsappCronUpdateData, context: HttpsContext, tools: HandlerTools) {
    try {
      tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Running`);

      this.projectId = admin.instanceId().app.options.projectId;
      const jobName = this.getJobName(data.bot);

      tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Checking if cron already exists`);

      const job = await this.checkIfJobExists(jobName);

      if (job) {
        tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Job ${job.name} already exists. Exiting...`);
        return;
      }

      const [res] = await this.createCronJob(data.channel, jobName);
    
      tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Job successfully created with Name: ${res.name}`);

    } catch (error) {
      tools.Logger.error(() => `[WhatsappMediaUpdateCronHandler] - Error in WhatsappMediaUpdateCronHandler: ${error.message}`);
    }
  }

  private async checkIfJobExists(jobName: string) {
    const [jobs] = await this.cloudSchedulerClient.listJobs({
      parent: `projects/${this.projectId}/locations/${this.locationId}`,
    })

    const job = jobs.find((job) => job.name === jobName);
    return job
  }

  private async createCronJob(channel: CommunicationChannel, jobName: string) {
    const endpoint = `https://${this.locationId}-${this.projectId}.cloudfunctions.net/channelWhatsappUploadMedia`;
    
    const body = JSON.stringify({data: channel});

    const currentTime = Timestamp.fromDate(new Date());
  
    const newJob: GcpJob = {
      name: jobName,
      httpTarget: {
        uri: endpoint,
        body: Buffer.from(body,'utf-8').toString('base64'),
        httpMethod: HttpMethodTypes.POST,
        headers: { 'Content-Type': 'application/json' },
      },
      schedule: '0 18 */30 * *',
      scheduleTime: currentTime,
      timeZone: 'Etc/UTC'
    };

    const request = {
      parent: `projects/${this.projectId}/locations/${this.locationId}`,
      job: newJob,
    };

    return this.cloudSchedulerClient.createJob(request as any);
  }

  private getJobName(bot: Bot): string {
    const jobPath = `projects/${this.projectId}/locations/${this.locationId}/jobs/`;
    const jobId = `${bot.id}`;

    return jobPath + jobId;
  }
}
