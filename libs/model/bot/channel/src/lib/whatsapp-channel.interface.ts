import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
export interface WhatsappChannel extends CommunicationChannel {
  //For each number used in the channel, it must be have a whatsapp business identifier
  // businessAccountId: string;
}