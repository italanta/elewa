import { IncomingMessage } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppMessagePayLoad } from "./raw-whatsapp-payload.interface";

export interface WhatsAppResponse extends IncomingMessage {

 /** Actual message being sent by the user to the bot */
  message: WhatsAppMessagePayLoad
}