import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { ScheduleOptions, UsersFilters } from "@app/model/convs-mgr/functions";

export interface ScheduleMessagesReq extends ScheduleOptions
{
  /** The message to be sent */
  message: TemplateMessage;
  
  /** The channel through which to send the message template */
  channelId: string;
}
