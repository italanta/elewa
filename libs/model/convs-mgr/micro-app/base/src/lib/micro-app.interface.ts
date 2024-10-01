import { CommunicationChannel, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { MicroAppTypes } from "./micro-app-types.enum";
import { PassCriteriaTypes } from "./pass-criteria-types.enum";

/**
 * Descriptive class of a micro app. 
 * Contains configurations of what constitutes a micro-app
 */
export interface MicroApp
{
  /** Type of micro-app */
  type: MicroAppTypes;

  /** URL to be called after the micro-app is done. The payload will include the user id and their data from the micro app e.g. Assessment results  */
  callBackUrl?: string;
  
  /** Organisation ID in which the micro-app lives */
  orgId: string;

  /** Channel over which the systems are communicating */
  channel: CommunicationChannel;

  /** Position of where the micro-app was initiated */
  pos: EndUserPosition;

  orgLogoUrl?: string;

  /** The story the micro-app is linked in */
  storyId?: string;

  /** The module the micro-app is linked in */
  moduleId?: string;

  /** The bot the micro-app is linked in */
  botId?: string;
}
 
/**
 * Specifications for assessment-specific micro-apps
 */
export interface AssessmentMicroApp extends MicroApp
{ 
  /** Pass criteria for the assessment */
  passCriteria: PassCriteriaTypes;
  /** Progress URL for the assessment */
  progressUrl: string;

  /** Storage Url of the uploaded pdf */
  pdf?: { name: string, url: string};
}

