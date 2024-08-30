import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { JobTypes } from "@app/model/convs-mgr/functions";
import { EndUserDataService, EnrolledUserDataService } from "@app/functions/bot-engine";
import { SendSurveyHandler } from "@app/private/functions/micro-apps/surveys";
import { SendMultipleMessagesHandler } from "@app/functions/bot-engine/send-message";

import { _getPayload } from "./utils/create-payload.util";
import { CheckInactivityReq } from "./model/check-inactivity-req";
import { __DateFromStorage } from "@iote/time";
import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

/**
 * Handler that is triggerred periodically to check for user inactivity. If the
 *  inactivity is more than the stated time, a message is sent to the user.
 */
export class CheckInactivityHandler extends FunctionHandler<CheckInactivityReq, any>
{
  async execute(cmd: CheckInactivityReq, context: FunctionContext, tools: HandlerTools) 
  {
    tools.Logger.log(() => `[CheckInactivityHandler].execute - Check Request: ${JSON.stringify(cmd)}`);
    const orgId = cmd.channel.orgId;

    const endUsersService = new EndUserDataService(tools, orgId);
    const enrolledUsersService = new EnrolledUserDataService(tools, orgId);

    try {
      const endUsers = await endUsersService.getAllEndUsers();
      const enrolledUsers = await enrolledUsersService.getEnrolledUsers();

      // Convert the hours to milliseconds
      const INACTIVE_THRESHOLD = cmd.scheduleOptions.inactivityTime * 60 * 60 * 1000;
      console.log(JSON.stringify(endUsers))
      // Get users whose have met the inactivity threshold
      const inactiveUsers = endUsers.filter((endUser)=> {
        // Only get new users within the last 24 hours
        const enrolled = __DateFromStorage(endUser.createdOn).unix() * 1000;
        const elapsedTime = new Date().getTime() - enrolled;

        return elapsedTime <= INACTIVE_THRESHOLD;
      }).filter((endUser) =>
      {
        if(!endUser.lastActiveTime) return false;
        console.log(endUser.lastActiveTime)
        const lastActiveTime = __DateFromStorage(endUser.lastActiveTime).unix() * 1000
        const timeDifference = new Date().getTime() - lastActiveTime;
        return timeDifference >= INACTIVE_THRESHOLD;
      }).map((user) => user.id);

      tools.Logger.log(() => `[CheckInactivityHandler].execute - Inactive users: ${JSON.stringify(inactiveUsers)}`);
      
      if(!inactiveUsers || inactiveUsers.length < 1) {
        return { success: false, message: "No inactive users found" };
      }

      // Get the enrolled users who are inactive
      const filteredInactiveUsers = enrolledUsers.filter((eu)=> inactiveUsers.includes(eu.whatsappUserId) && !eu.completedCourses);

      const learnersWithName = filteredInactiveUsers.map(learner => {
        const endUser = endUsers.find(l => l.id === learner.whatsappUserId);
        return {
          ...learner,
          name: endUser && endUser.variables ? endUser.variables['name'] : ' ' // or handle the case where the name isn't found
        };
      }) as EnrolledEndUser[];

      const payload = _getPayload(cmd.scheduleOptions, cmd.channel, learnersWithName, cmd.message);

      tools.Logger.log(() => `[CheckInactivityHandler].execute - Payload to send: ${JSON.stringify(payload)}`);
      
      const response = await this._sendMessage(payload, cmd.scheduleOptions.type, context, tools);
      
      tools.Logger.log(() => `[CheckInactivityHandler].execute - Completed: ${JSON.stringify(response)}`);
      return { success: true, response };
    } catch (error) {
      tools.Logger.log(() => `[CheckInactivityHandler].execute - Error Checking inactivity Task: ${error}`);
      return { success: false, error };
    }
  }

  private _sendMessage(payload: any, type: JobTypes, context: any, tools: HandlerTools)
  {
    switch (type) {
      case JobTypes.Survey:
        return new SendSurveyHandler().execute(payload, context, tools);
      case JobTypes.SimpleMessage:
        return new SendMultipleMessagesHandler().execute(payload, context, tools);
      default:
        return new SendMultipleMessagesHandler().execute(payload, context, tools);
    }
  }
}