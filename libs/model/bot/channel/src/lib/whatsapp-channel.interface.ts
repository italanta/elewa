import { CommunicationChannel } from "./base-channel.interface";

export interface WhatsappChannel extends CommunicationChannel {
  //For each number used in the channel, it must be have a whatsapp business identifier
  // businessAccountId: string;
}