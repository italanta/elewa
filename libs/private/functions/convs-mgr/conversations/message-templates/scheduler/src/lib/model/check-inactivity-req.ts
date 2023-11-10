import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { ScheduleOptions } from "@app/model/convs-mgr/functions";

export interface CheckInactivityReq 
{
  message: TemplateMessage;
  channel: CommunicationChannel;
  scheduleOptions: ScheduleOptions;
}