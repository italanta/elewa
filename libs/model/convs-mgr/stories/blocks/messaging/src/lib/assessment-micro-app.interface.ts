import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { MicroAppStatus, MicroAppTypes, PassCriteriaTypes } from "./micro-app-block.interface";


/**
 * The interface for an assessment specific Micro App. 
 */

export interface AssessmentMicroApp extends StoryBlock, MicroAppStatus {
  /** The ID of the micro app, will be used in navigation */
  microAppId: string;

  microAppType: MicroAppTypes.Assessment;

  progressStatus: PassCriteriaTypes;
}
