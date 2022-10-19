import { BaseChannel } from "./base-channel.interface";

export interface WhatsappChannel extends BaseChannel {
  //For each number used in the channel, it must be have a whatsapp business identifier
  // businessId: string;
}