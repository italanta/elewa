import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { MicroAppConfig } from "./micro-app-config.interface";
import { MicroAppStatusTypes } from "./micro-app-status-types.interface";
import { IObject } from "@iote/bricks";

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
  /** App config and interesting details such as organisation ID and callbacks */
  config: MicroAppConfig;
  
  /** The current progress of the app */
  status: MicroAppStatusTypes;
  /** Execution of the micro-app started on (in ms) */
  startedOn?: number;
  /** Micro-app finished on (in ms) */
  finishedOn?: number;
}
