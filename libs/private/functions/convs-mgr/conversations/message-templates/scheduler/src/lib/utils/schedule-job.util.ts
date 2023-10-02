// This file interacts with the GCP Cloud Scheduler to schedule, update or delete timed jobs.
//  Ref. https://googleapis.dev/nodejs/scheduler/1.1.1/index.html
//
import { CloudSchedulerClient } from '@google-cloud/scheduler';
import { Timestamp } from '@firebase/firestore-types';

import { HandlerTools } from '@iote/cqrs';

import { ScheduledMessage } from '@app/model/convs-mgr/functions';

import { GcpJob, HttpMethodTypes } from '../model/gcp/gcp-job.interface';

/**
 * Schedules the message to be sent on google cloud scheduler 
 *
 * @param msgToSend 
 * @param tools 
 * @returns 
 */
export async function ScheduleMessage(msgToSend: ScheduledMessage, tools: HandlerTools)
{
  const PROJECT_ID = process.env.GCLOUD_PROJECT;
  const LOCATION_ID = JSON.parse(process.env.FIREBASE_CONFIG).locationId

  const endpoint = `https://${LOCATION_ID}-${PROJECT_ID}.cloudfunctions.net/sendScheduledMessages`

  const parent = getParent(PROJECT_ID, LOCATION_ID);
  const job = createJob(msgToSend, endpoint);

  const response = await callCreateJob(parent, job);

  tools.Logger.log(()=> `[ScheduleMessage]- ${JSON.stringify(response)}`);

  return response;
  }

  function callCreateJob(parent: string, job: GcpJob)
  {
    const schedulerClient = new CloudSchedulerClient();
    // Construct request
    const request = {
      parent,
      job
    };
  
    // Run request
    return schedulerClient.createJob(request as any);
  }

  function createJob(msgToSend: ScheduledMessage, endpoint: string): GcpJob {

    const payload = JSON.stringify(msgToSend);

    const job: GcpJob = {
      name: `${msgToSend.message.name}_${Date.now()}_${msgToSend.dispatchTime.getTime()}`,
      httpTarget: {
        uri: endpoint,
        body: payload,
        httpMethod: HttpMethodTypes.POST,
        headers: { 'Content-Type': 'application/json' },
      },

      scheduleTime: {
        seconds: Math.floor(msgToSend.dispatchTime.getTime() / 1000),
        // Get nanos and millis.
        nanoseconds: (msgToSend.dispatchTime.getTime() / 1000 - Math.floor(msgToSend.dispatchTime.getTime() / 1000)) * 1000000,
      } as Timestamp
    }

    return job;
  }

  const getParent = (projectId: string, locationId: string) => `projects/${projectId}/locations/${locationId}`;