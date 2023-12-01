import { google } from "@google-cloud/tasks/build/protos/protos";

import { Timestamp } from "@firebase/firestore-types";

/**
 * A Google Cloud Job which can be scheduled on the Cloud Tasks
 * 
 * @see https://googleapis.dev/nodejs/scheduler/latest/google.cloud.scheduler.v1beta1.IJob.html
 */
export interface GcpTask extends google.cloud.tasks.v2beta3.ITask
{
  /** 
   * The name of the job. 
   * @important - The name of the job acts as the ID of the job. 
   *              So it needs to be used to e.g. view job details 
   *                and to update/delete the job.
   */
  name: string;
  description?: string;

  /** In case of a Cloud Scheduler, the time at which to perform the action */
  scheduleTime: Timestamp;
}