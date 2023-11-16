import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { ScheduleOptions } from "@app/model/convs-mgr/functions";

export interface SetInacivityReq extends ScheduleOptions
{
  message: TemplateMessage;
  inactivityTime: number; 
  channelId: string;
}