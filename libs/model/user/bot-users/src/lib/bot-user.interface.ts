import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { IObject } from "@iote/bricks";

export interface BotUser extends IObject {
  phoneNumber: string;
  channelsRegistered?: PlatformType[];  
}
