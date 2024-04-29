import { CloudSchedulerClient } from '@google-cloud/scheduler';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Bot } from '@app/model/convs-mgr/bots';
import { HttpMethodTypes } from '@app/model/convs-mgr/stories/blocks/main';

/** Handler responsible for managing and creating whatspp app media update cron job when a bot is published */
export class WhatsappUploadMediaCronHandler extends FunctionHandler<any, any> {
  private cloudSchedulerClient: CloudSchedulerClient;
  private projectId: string;
  private locationId = 'europe-west1';

  constructor(projectId:string = process.env.GCLOUD_PROJECT) {
    super();
    this.projectId = projectId;
    this.cloudSchedulerClient = new CloudSchedulerClient();
  }

  public async execute(data: any, context: HttpsContext, tools: HandlerTools) {
    try {
      tools.Logger.log(() => `[WhatsappMediaUpdateCronHandler] - Updating whatsapp Media`);

      const endpoint = this.getEndpoint();
      const jobName = this.getJobName(data.bot as Bot);

      const [job, ...jobs] = await this.cloudSchedulerClient.getJob({
        name: jobName,
      });

      console.log({job, jobs});

      if (job) return;

      const body = JSON.stringify(data.channel);

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

      const res = this.cloudSchedulerClient.createJob(request);
      console.log({res});

    } catch (error) {
      tools.Logger.error(() => `[WhatsappMediaUpdateCronHandler] - Error in WhatsappMediaUpdateCronHandler: ${error.message}`);
      console.error(error.message);
    }
  }

  private getJobName(bot: Bot): string {
    const jobPath = `projects/${this.projectId}/locations/${this.locationId}/jobs/`;
    const jobId = `${bot.id}`;

    return jobPath + jobId;
  }

  private getEndpoint(): string {
    return `https://${this.locationId}-${this.projectId}.cloudfunctions.net/channelWhatsappUploadMedia`;
  }
}
