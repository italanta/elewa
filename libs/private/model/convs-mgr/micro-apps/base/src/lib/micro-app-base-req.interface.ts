import { MicroAppConfig } from "@app/model/convs-mgr/stories/blocks/messaging";
import { IObject } from "@iote/bricks";

/** The object we send to our micro-app base handler to get permission to interact with 
 * a  given micro-app
 * A user should not be able to access a micro app unlesss the data below is sent alongside their request
 */
export interface MicroAppBaseRequest extends IObject{
  orgId: string;
  userId: string;
  appId: string;
  configs: MicroAppConfig
}
