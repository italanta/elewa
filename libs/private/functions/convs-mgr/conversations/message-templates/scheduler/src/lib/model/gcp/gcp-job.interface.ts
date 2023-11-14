import { Timestamp } from "@firebase/firestore-types";

/**
 * A Google Cloud Job which can be scheduled on the Cloud Scheduler to run on a
 *  recurring mannner. Google cloud scheduler supports recurring jobs as cron.
 * 
 * @see https://googleapis.dev/nodejs/scheduler/latest/google.cloud.scheduler.v1beta1.IJob.html
 */
export interface GcpJob
{
  /** 
   * The name of the job. 
   * @important - The name of the job acts as the ID of the job. 
   *              So it needs to be used to e.g. view job details 
   *                and to update/delete the job.
   */
  name: string;
  description?: string;

  /** Cron expression for the job schedule */
  schedule: string;

  httpTarget: {
    uri: string;
    httpMethod: HttpMethodTypes;
    headers: ({ [k: string]: string }|null);
    body: string;
  };

  /** In case of a Cloud Scheduler, the time at which to perform the action */
  scheduleTime: Timestamp;
}

export enum HttpMethodTypes {
  HTTP_METHOD_UNSPECIFIED = 0,
  POST = 1,
  GET = 2,
  HEAD = 3,
  PUT = 4,
  DELETE = 5,
  PATCH = 6,
  OPTIONS = 7
}
