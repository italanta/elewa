import { ScheduleOptions } from "./schedule-options.interface";

export interface ScheduledMessage extends ScheduleOptions
{
  /** Ids of the end users who have been successfully sent the message */
  successful?: string[];
  
  /** Ids of the end users who fail */
  failed?: string[];

  /** 
   * Ids of the end users who are yet to receive the message
   * 
   * TODO: Implement logic to check the read receipt of the template messages
   */
  pending?: string[];

  status?: ScheduledMessageStatus;

  scheduledOn?: Date;
}

export enum ScheduledMessageStatus 
{
  Active = 1,
  Pending = 2,
  Stopped = 0
}