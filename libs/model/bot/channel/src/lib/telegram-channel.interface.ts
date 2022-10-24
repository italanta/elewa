import { BaseChannel } from "./base-channel.interface";

export interface TelegramChannel extends BaseChannel {
  //For each number used in the channel, it must be have a
  // businessAccountId: string;
}