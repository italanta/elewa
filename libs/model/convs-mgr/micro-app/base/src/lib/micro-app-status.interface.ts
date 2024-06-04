import { MicroAppConfig } from "./micro-app-config.interface";
import { MicroAppStatusTypes } from "./micro-app-status-types.interface";

/** 
 * Tracks the status of a Micro app through out a learner's engagement with it
 * @currentSection
 * @config
 * @status
 * Assessment status will extend this interface */
export interface MicroAppStatus
{
  /** The unique Id of the microapp */
  appId: string;
  currentSection?: MicroAppSectionTypes;
  config: MicroAppConfig;
  status: MicroAppStatusTypes;
  startedOn: Date;
  finishedOn?: Date;
  timestamp: number;
}

/** Parts of a a Micro-app screen */
export enum MicroAppSectionTypes
{
  /** Start page / landing page */
  Start = 0,
  /** Main content consumption section */
  Main = 1,
  /** A user has finished their course and is being redirected back to  the messaging platform */
  Redirect = 2
}
