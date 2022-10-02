import { ChannelOptions } from "@app/model/bot/channel";
import { IObject } from "@iote/bricks";

export interface BotUser extends IObject {
  phoneNumber: string;
  channelsRegistered?: ChannelOptions[];  
}
