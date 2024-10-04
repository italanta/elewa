import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { MicroAppTypes, MicroAppStatus, PassCriteriaTypes } from "@app/model/convs-mgr/micro-app/base";

/** High level MicroApp definition */
export interface MicroAppBlock extends StoryBlock 
{
  /** will be used to create the url */
  appId?: string;
  /** The name of the micro app. Will be used as the link display text */
  name?: string;

  /** The type of the micro-app e.g. assessment */
  appType?: MicroAppTypes;

  /** Additional data for the microApp to run */
  configs?: MicroAppConfig;
  /** Comprehensive micro-app data  */
  status?: MicroAppStatus;

  /** The story the micro-app is linked in */
  storyId?: string;

  /** The module the micro-app is linked in */
  moduleId?: string;

  /** The bot the micro-app is linked in */
  botId?: string;
}

export interface MicroAppConfig 
{
  /** URL to be called after the micro-app is done. The payload will include the user id and their data from the micro app e.g. Assessment results  */
  callbackUrl: string;
  
  /** Type of micro-app */
  type: MicroAppTypes;

  passMark?: number;

  /** Pass criteria for the assessment */
  passCriteria: PassCriteriaTypes;
  /** Progress URL for the assessment */
  progressUrl: string;
}