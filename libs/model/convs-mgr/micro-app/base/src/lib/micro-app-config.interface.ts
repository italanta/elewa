import { MicroAppTypes } from "./micro-app-types.enum";
import { PassCriteriaTypes } from "./pass-criteria-types.enum";

export interface MicroAppConfig
{
  passCriteria?: PassCriteriaTypes;

  type: MicroAppTypes;

  progressUrl?: string;

  /** URL to be called after the micro-app is done. The payload will include the user id and their data from the micro app e.g. Assessment results  */
  callBackUrl?: string;
}
