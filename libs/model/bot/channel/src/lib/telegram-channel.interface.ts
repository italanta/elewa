import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export interface TelegramChannel extends CommunicationChannel {
  //For each number used in the channel, it must be have a
  // businessAccountId: string;
}