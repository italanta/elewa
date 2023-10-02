import { IObject } from "@iote/bricks";

import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";

export interface ScheduledMessage extends IObject
{
  n: number,

  plaform: PlatformType;

  message: any,

  /**
   * This can be an array of phone numbers if it's on whatsapp or an array of
   *  recepientIds, on messenger. The unique identifier through which the end user
   *   receives the message.
   */
  endUsers: string[];

  /** JOB ID - As scheduled on GCP Tasks */
  taskId?: string;

  /** The time scheduled for the message to be sent */
  dispatchTime: Date;

  /** Interval to send message templates to users in cron format */
  frequency?: string;
}