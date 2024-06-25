import { EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { MicroAppTypes } from "./micro-app-types.enum";
import { PassCriteriaTypes } from "./pass-criteria-types.enum";

export interface MicroAppConfig
{
  /** Type of micro-app */
  type: MicroAppTypes;

  /** URL to be called after the micro-app is done. The payload will include the user id and their data from the micro app e.g. Assessment results  */
  callBackUrl?: string;
  
  /** Organisation ID in which the micro-app lives */
  orgId: string;

  /** Position of where the micro-app was initiated */
  pos: EndUserPosition;
}

/**
 * Specifications for assessment-specific micro-apps
 */
export interface AssessmentMicroAppConfig extends MicroAppConfig
{ 
  /** Pass criteria for the assessment */
  passCriteria: PassCriteriaTypes;
  /** Progress URL for the assessment */
  progressUrl: string;
}

