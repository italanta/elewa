// This file interacts with the GCP Cloud Scheduler to schedule, update or delete timed jobs.
//  Ref. https://googleapis.dev/nodejs/scheduler/1.1.1/index.html
//
import { CloudSchedulerClient } from '@google-cloud/scheduler';
import { Timestamp } from '@firebase/firestore-types';

import { HandlerTools } from '@iote/cqrs';

import { ScheduleOptions } from '@app/model/convs-mgr/functions';

import { GcpTask } from '../model/gcp/gcp-task.interface';
import { GcpJob, HttpMethodTypes } from '../model/gcp/gcp-job.interface';

/**
 * Schedules the message to be sent on google cloud scheduler 
 *
 * @param msgToSend 
 * @param tools 
 * @returns 
 */
export async function ScheduleRecurringJob(payload: any, options: ScheduleOptions, tools: HandlerTools)
{
  const PROJECT_ID = process.env.GCLOUD_PROJECT;
  const LOCATION_ID = 'europe-west1';
  const cloudTask = new CloudSchedulerClient();

  const endpoint = `https://${LOCATION_ID}-${PROJECT_ID}.cloudfunctions.net/${payload.functionName}`;

  const parent = `projects/${PROJECT_ID}/locations/${LOCATION_ID}`

  const jobPath = parent + '/jobs/';

  const jobName = _getJobName(jobPath, options.dispatchTime, options.id);

  const job = generateJob(payload, options, jobName, endpoint);

  const request = { parent, job };

  const [response] = await cloudTask.createJob(request);

  tools.Logger.log(()=> `[ScheduleMessage]- ${JSON.stringify(response)}`);

  return response;
  }

/**
 * Deletes a job, hence marking the end of the recurring job. This will
 *  be executed from cloud tasks as it'll only be needed to run once.
 * 
 * @param msgToSend 
 * @param tools 
 * @returns 
 */
export async function DeleteJob(jobName: string, tools: HandlerTools)
{
  const cloudTask = new CloudSchedulerClient();

  const request = { name: jobName };

  const [response] = await cloudTask.deleteJob(request);

  tools.Logger.log(()=> `[ScheduleMessage].Delete Job - ${JSON.stringify(response)}`);

  return response;
  }


  /**
   * @see https://cloud.google.com/scheduler/docs/reference/rpc/google.cloud.scheduler.v1#google.cloud.scheduler.v1.Job
   */
  function generateJob(payload: any, options: ScheduleOptions, jobName: string, endpoint: string): GcpTask {

    const body = JSON.stringify({data: {...payload}});

    const task: GcpJob = {
      name: jobName,
      httpTarget: {
        uri: endpoint,
        body: Buffer.from(body).toString("base64"),
        httpMethod: HttpMethodTypes.POST,
        headers: { 'Content-Type': 'application/json' },
      },

      schedule: options.frequency,

      scheduleTime: {
        seconds: Math.floor(options.dispatchTime.getTime() / 1000),
        // Get nanos and millis.
        nanoseconds: (options.dispatchTime.getTime() / 1000 - Math.floor(options.dispatchTime.getTime() / 1000)) * 1000000,
      } as Timestamp
    }

    return task;
  }

  function _getJobName(path: string, dispatchTime: Date, name: string)
  {
    const jobId = `${name}_${dispatchTime.getTime()}_${Date.now()}`;
  
    return path + jobId;
  }
  // const getParent = (projectId: string, locationId: string) => `projects/${projectId}/locations/${locationId}`;