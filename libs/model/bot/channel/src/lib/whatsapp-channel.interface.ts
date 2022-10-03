import { BaseChannel } from "./base-channel.model";

export interface WhatsappChannel extends BaseChannel {
  //For each number used in the channel, it must be have a whatsapp business identifier
  whatsappBusinessId: string;

  //This string is set up by you, when you create your webhook endpoint.
  verifyToken:string;

}