import { SendMessageTemplate } from "./send-message-template.interface";

export interface ScheduledMessage extends SendMessageTemplate
{
  /** JOB ID - As scheduled on GCP Tasks */
  taskId?: string;

  /** The time scheduled for the message to be sent */
  dispatchTime: Date;

  /** Interval to send message templates to users in cron format */
  frequency?: string;
}