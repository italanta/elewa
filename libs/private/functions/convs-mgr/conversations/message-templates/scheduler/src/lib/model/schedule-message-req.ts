import { Message } from "@app/model/convs-mgr/conversations/messages";
import { UsersFilters } from "@app/model/convs-mgr/functions";

export interface ScheduleMessagesReq
{
  /** The message to be sent */
  message: Message;
  channelId: string;
  /** The time scheduled for the message to be sent */
  dispatchTime: Date;

  /** Filters to select the users to send the message to. 
   * 
   * If filters are not specficied, the message will be sent to all end users
   *  in that organisation.
   */
  usersFilters?: UsersFilters;

  /** Interval to send message templates to users in cron format */
  frequency?: string;
}
