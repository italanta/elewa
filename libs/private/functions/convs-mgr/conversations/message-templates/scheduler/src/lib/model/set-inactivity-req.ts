import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { ScheduleOptions } from "@app/model/convs-mgr/functions";

export interface SetInacivityReq extends ScheduleOptions
{
  message: TemplateMessage;

  /** Maximum defined period of inactivity in hours */
  inactivityTime: number; 
  
  channelId: string;
}