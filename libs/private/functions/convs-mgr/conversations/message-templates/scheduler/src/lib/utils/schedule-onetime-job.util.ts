// This file interacts with the GCP Cloud Scheduler to schedule, update or delete timed jobs.
//  Ref. https://googleapis.dev/nodejs/scheduler/1.1.1/index.html
//
import { CloudTasksClient } from '@google-cloud/tasks';
import { Timestamp } from '@firebase/firestore-types';

import { HandlerTools } from '@iote/cqrs';

import { ScheduleOptions } from '@app/model/convs-mgr/functions';

import { GcpTask } from '../model/gcp/gcp-task.interface';

/**
 * Schedules the message to be sent on google cloud scheduler 
 *
 * @param msgToSend 
 * @param tools 
 * @returns 
 */
export async function ScheduleTask(payload: any, options: ScheduleOptions, tools: HandlerTools)
{
  const PROJECT_ID = process.env.GCLOUD_PROJECT;
  const LOCATION_ID = 'europe-west1';
  const cloudTask = new CloudTasksClient();

  const endpoint = `https://${LOCATION_ID}-${PROJECT_ID}.cloudfunctions.net/${payload.functionName}`;

  const parent = cloudTask.queuePath(PROJECT_ID, LOCATION_ID, 'scheduled-messages');

  const taskPath = `projects/${PROJECT_ID}/locations/${LOCATION_ID}/queues/scheduled-messages/tasks/`;

  const taskName = _getTaskName(taskPath, options.dispatchTime, options.id);

  const task = generateTask(payload, options, taskName, endpoint);

  const request = { parent, task };

  const [response] = await cloudTask.createTask(request);

  tools.Logger.log(() => `[ScheduleMessage]- ${JSON.stringify(response)}`);

  return response;
}

function generateTask(payload: any, options: ScheduleOptions, taskName: string, endpoint: string): GcpTask
{

  const body = JSON.stringify({ data: { ...payload } });

  const task: GcpTask = {
    name: taskName,
    httpRequest: {
      url: endpoint,
      body: Buffer.from(body).toString("base64"),
      httpMethod: 1,
      headers: { 'Content-Type': 'application/json' },
    },

    scheduleTime: {
      seconds: Math.floor(options.dispatchTime.getTime() / 1000),
      // Get nanos and millis.
      nanoseconds: (options.dispatchTime.getTime() / 1000 - Math.floor(options.dispatchTime.getTime() / 1000)) * 1000000,
    } as Timestamp
  };

  return task;
}

/**
 * Returns a unique task name to be used for creating the cloud task.
 * 
 * @param path - Path to the task
 * @param dispatchTime - The time the task will be dispached
 * @param name - Name of the survey/template 
 * @returns 
 */
function _getTaskName(path: string, dispatchTime: Date, name: string)
{
  const taskId = `${name}_${dispatchTime.getTime()}_${Date.now()}`;

  return path + taskId;
}

// const getParent = (projectId: string, locationId: string) => `projects/${projectId}/locations/${locationId}`;