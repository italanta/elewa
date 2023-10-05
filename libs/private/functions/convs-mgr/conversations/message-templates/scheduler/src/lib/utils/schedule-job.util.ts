// This file interacts with the GCP Cloud Scheduler to schedule, update or delete timed jobs.
//  Ref. https://googleapis.dev/nodejs/scheduler/1.1.1/index.html
//
import { CloudTasksClient } from '@google-cloud/tasks';
import { Timestamp } from '@firebase/firestore-types';

import { HandlerTools } from '@iote/cqrs';

import { ScheduledMessage } from '@app/model/convs-mgr/functions';

import { GcpTask } from '../model/gcp/gcp-job.interface';

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
  const LOCATION_ID = 'europe-west1';
  const cloudTask = new CloudTasksClient();

  const endpoint = `https://${LOCATION_ID}-${PROJECT_ID}.cloudfunctions.net/sendScheduledMessages`

  const parent = cloudTask.queuePath(PROJECT_ID, LOCATION_ID, 'scheduled-messages');

  const taskPath = `projects/${PROJECT_ID}/locations/${LOCATION_ID}/queues/scheduled-messages/tasks/`

  const task = generateTask(msgToSend, endpoint, taskPath);

  const request = { parent, task };

  const [response] = await cloudTask.createTask(request);

  tools.Logger.log(()=> `[ScheduleMessage]- ${JSON.stringify(response)}`);

  return response;
  }

  /**
   * @see https://cloud.google.com/scheduler/docs/reference/rpc/google.cloud.scheduler.v1#google.cloud.scheduler.v1.Job
   */
  function generateTask(msgToSend: ScheduledMessage, endpoint: string, path: string): GcpTask {

    const payload = JSON.stringify(msgToSend);

    const taskId =  `${msgToSend.message.name}_${msgToSend.dispatchTime.getTime()}`;

    const task: GcpTask = {
      name: path + taskId,
      httpRequest: {
        url: endpoint,
        body: Buffer.from(payload).toString("base64"),
        httpMethod: 1,
        headers: { 'Content-Type': 'application/json' },
      },

      scheduleTime: {
        seconds: Math.floor(msgToSend.dispatchTime.getTime() / 1000),
        // Get nanos and millis.
        nanoseconds: (msgToSend.dispatchTime.getTime() / 1000 - Math.floor(msgToSend.dispatchTime.getTime() / 1000)) * 1000000,
      } as Timestamp
    }

    return task;
  }

  // const getParent = (projectId: string, locationId: string) => `projects/${projectId}/locations/${locationId}`;