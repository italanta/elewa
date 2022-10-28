import { CommunicationChannel } from "./base-channel.interface";

export interface TelegramChannel extends CommunicationChannel {
  //For each number used in the channel, it must be have a
  // businessAccountId: string;
}