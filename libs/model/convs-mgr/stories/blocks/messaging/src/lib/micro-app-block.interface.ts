import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { MicroAppTypes, MicroAppConfig, MicroAppStatus } from "@app/model/convs-mgr/micro-app/base";

/** High level MicroApp definition */
export interface MicroAppBlock extends StoryBlock 
{
  /** will be used to create the url */
  appId: string;
  /** The name of the micro app. Will be used as the link display text */
  appName: string;

  /** The type of the micro-app e.g. assessment */
  appType: MicroAppTypes;

  /** Additional data for the microApp to run */
  configs: MicroAppConfig;
  /** Comprehensive micro-app data  */
  appStatus?: MicroAppStatus;
}