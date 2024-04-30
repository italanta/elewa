import * as admin from 'firebase-admin';
import { CloudSchedulerClient } from '@google-cloud/scheduler';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Bot } from '@app/model/convs-mgr/bots';
import { HttpMethodTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

/** Handler responsible for managing and creating whatspp app media update cron job when a bot is published */
export class WhatsappUploadMediaCronHandler extends FunctionHandler<any, any> {
  private cloudSchedulerClient: CloudSchedulerClient;
  private projectId: string;
  private locationId = 'europe-west1';

  constructor() {
    super();
    this.cloudSchedulerClient = new CloudSchedulerClient();
  }

  public async execute(data: { channel: CommunicationChannel, bot: Bot }, context: HttpsContext, tools: HandlerTools) {
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

      tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Creating Whatsapp media cron job`);

      const res = await this.createCronJob(data.channel, jobName);
    
      tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Job successfully created with Name: ${res[0].name}`);
      console.log({res});

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
    const body = JSON.stringify(channel);

    const newJob = {
      name: jobName,
      httpTarget: {
        uri: endpoint,
        body: Buffer.from(body,'utf-8').toString('base64'),
        httpMethod: HttpMethodTypes.POST,
        headers: { 'Content-Type': 'application/json' },
      },
      schedule: '0 18 * * *',
    };

    const request = {
      parent: `projects/${this.projectId}/locations/${this.locationId}`,
      newJob,
    };

    return this.cloudSchedulerClient.createJob(request);
  }

  private getJobName(bot: Bot): string {
    const jobPath = `projects/${this.projectId}/locations/${this.locationId}/jobs/`;
    const jobId = `${bot.id}`;

    return jobPath + jobId;
  }
}
