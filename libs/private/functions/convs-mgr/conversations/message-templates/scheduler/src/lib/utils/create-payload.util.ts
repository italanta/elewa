import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { JobTypes, ScheduleOptions } from "@app/model/convs-mgr/functions";

import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

export function CreateTemplateMessagePayload (options: ScheduleOptions, channel: CommunicationChannel, endUserIds: string[], msg: TemplateMessage) 
{
  return {
    message: msg,
    functionName: 'sendMultipleMessages',
    n: channel.n,
    plaform: channel.type,
    endUserIds: endUserIds,
    dispatchTime: new Date(options.dispatchTime)
  };
}

export function CreateSurveyPayload (options: ScheduleOptions,channel: CommunicationChannel, endUserIds: string[], msg: TemplateMessage) 
{
  return {
    functionName: 'sendSurvey',
    endUserIds: endUserIds,
    surveyId: options.id,
    messageTemplateId: msg.id,
    channelId: channel.id
  };
}

export function _getPayload(options: ScheduleOptions,channel: CommunicationChannel, endUserIds: string[], msg: TemplateMessage)
{
  switch (options.type) {
    case JobTypes.Survey:
      return CreateSurveyPayload(options, channel, endUserIds, msg);
    case JobTypes.SimpleMessage:
      return CreateTemplateMessagePayload(options, channel, endUserIds, msg);
    default:
      return CreateTemplateMessagePayload(options, channel, endUserIds, msg);
  }
}