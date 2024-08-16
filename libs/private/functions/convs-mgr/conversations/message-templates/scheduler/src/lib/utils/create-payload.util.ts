import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { JobTypes, ScheduleOptions } from "@app/model/convs-mgr/functions";

import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

export function CreateTemplateMessagePayload (options: ScheduleOptions, channel: CommunicationChannel, inactiveUsers: EnrolledEndUser[], msg: TemplateMessage) 
{
  return {
    message: msg,
    functionName: 'sendMultipleMessages',
    n: channel.n,
    plaform: channel.type,
    enroledEndUsers: inactiveUsers,
    dispatchTime: new Date(options.dispatchTime)
  };
}

export function CreateSurveyPayload (options: ScheduleOptions,channel: CommunicationChannel, inactiveUsers: EnrolledEndUser[], msg: TemplateMessage) 
{
  return {
    functionName: 'sendSurvey',
    enroledEndUsers: inactiveUsers,
    surveyId: options.id,
    messageTemplateId: msg.id,
    channelId: channel.id
  };
}

export function _getPayload(options: ScheduleOptions,channel: CommunicationChannel, inactiveUsers: EnrolledEndUser[], msg: TemplateMessage)
{
  switch (options.type) {
    case JobTypes.Survey:
      return CreateSurveyPayload(options, channel, inactiveUsers, msg);
    case JobTypes.SimpleMessage:
      return CreateTemplateMessagePayload(options, channel, inactiveUsers, msg);
    default:
      return CreateTemplateMessagePayload(options, channel, inactiveUsers, msg);
  }
}