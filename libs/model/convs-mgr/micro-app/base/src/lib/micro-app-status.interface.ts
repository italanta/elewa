import { IObject } from "@iote/bricks";

import { MicroApp } from "./micro-app.interface";
import { MicroAppStatusTypes } from "./micro-app-status-types.interface";
import { MicroAppSectionTypes } from "./microapp-section-types.enum";

/** 
 * Tracks the status of a Micro app through out a learner's engagement with it
 * @currentSection
 * @config
 * @status
 * Assessment status will extend this interface */
export interface MicroAppStatus extends IObject
{
  /** The unique Id of the microapp */
  appId: string;
  /** The end user inititation the app */
  endUserId: string;
  endUserName?: string;
  /** App config and interesting details such as organisation ID and callbacks */
  config: MicroApp;
  
  /** The current progress of the app */
  status: MicroAppStatusTypes;
  /** Execution of the micro-app started on (in ms) */
  startedOn?: number;
  /** Micro-app finished on (in ms) */
  finishedOn?: number;
  /** Section a user is on in a Microapp, esp for assessments */
  microAppSection?: MicroAppSectionTypes
}
