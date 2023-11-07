import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

import { ScheduleMessagesReq } from "../model/schedule-message-req";

export function CreateTemplateMessagePayload (cmd: ScheduleMessagesReq, channel: CommunicationChannel, endUsers: string[]) 
{
  return {
    ...cmd,
    functionName: 'sendMultipleMessages',
    n: channel.n,
    plaform: channel.type,
    endUsers: endUsers,
    dispatchTime: new Date(cmd.dispatchTime)
  };
}

export function CreateSurveyPayload (cmd: ScheduleMessagesReq, channel: CommunicationChannel, enrolledUserIds: string[]) 
{
  return {
    functionName: 'sendSurvey',
    enrolledUserIds: enrolledUserIds,
    surveyId: cmd.id,
    messageTemplateName: cmd.message.name,
    channelId: channel.id
  };
}