import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { JobTypes, ScheduleOptions } from "@app/model/convs-mgr/functions";

import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

export function CreateTemplateMessagePayload (options: ScheduleOptions, channel: CommunicationChannel, endUsersIds: string[], msg: TemplateMessage) 
{
  return {
    message: msg,
    functionName: 'sendMultipleMessages',
    n: channel.n,
    plaform: channel.type,
    endUsersIds: endUsersIds,
    dispatchTime: new Date(options.dispatchTime)
  };
}

export function CreateSurveyPayload (options: ScheduleOptions,channel: CommunicationChannel, endUsersIds: string[], msg: TemplateMessage) 
{
  return {
    functionName: 'sendSurvey',
    endUsersIds: endUsersIds,
    surveyId: options.id,
    messageTemplateName: msg.name,
    channelId: channel.id
  };
}

export function _getPayload(options: ScheduleOptions,channel: CommunicationChannel, endUsersIds: string[], msg: TemplateMessage)
{
  switch (options.type) {
    case JobTypes.Survey:
      return CreateSurveyPayload(options, channel, endUsersIds, msg);
    case JobTypes.SimpleMessage:
      return CreateTemplateMessagePayload(options, channel, endUsersIds, msg);
    default:
      return CreateTemplateMessagePayload(options, channel, endUsersIds, msg);
  }
}