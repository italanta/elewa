import { Bot } from '@app/model/convs-mgr/bots';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

export interface WhatsappCronUpdateData {
  channel: CommunicationChannel;
  bot: Bot;
}
