import { IObject } from "@iote/bricks";

export interface BaseChannel extends IObject {
  //Channel which bot will be used
  channelName: ChannelOptions;

  //Number to be used in channel when communicating 
  businessPhoneNumber: string;

  //organisation/business that is using the channel for communication using the bot
  orgId: string;

  //Story which channel is pointing to
  storyId: string;

  //unique key used for particular channel
  authorizationKey?: string;

}

export enum ChannelOptions {
  WHATSAPP = "whatsapp",
  TELEGRAM = "telegram",
  SMS = "sms"
}