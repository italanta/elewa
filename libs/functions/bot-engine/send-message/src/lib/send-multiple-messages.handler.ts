import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";
import { Query } from "@ngfi/firestore-qbuilder";

import { MessageTypes, ScheduledMessage } from "@app/model/convs-mgr/functions";
import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { MessageDirection, TemplateMessage } from "@app/model/convs-mgr/conversations/messages";
import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

import { SendOutgoingMsgHandler } from "./send-outgoing-message.handler";
import { SendMultipleMessagesResp } from "./models/send-multiple-messages-rep.interface";
import { SendMultipleMessagesReq } from "./models/send-multiple-messages-req.interface";

export class SendMultipleMessagesHandler extends FunctionHandler<SendMultipleMessagesReq, SendMultipleMessagesResp>
{
  async execute(cmd: SendMultipleMessagesReq, context: FunctionContext, tools: HandlerTools) 
  {
    try {
      tools.Logger.log(()=> `[SendMultipleMessagesHandler].execute - Received request: ${JSON.stringify(cmd)}`);
      
      const response = await this._sendMessages(cmd, tools);
      
      if(cmd.scheduleId && response) {
        const scheduleRepo$ = tools.getRepository<ScheduledMessage>(`orgs/${cmd.orgId}/scheduled-messages`);
        
        const executionsRepo$ = tools.getRepository<any>(`orgs/${cmd.orgId}/scheduled-messages/${cmd.scheduleId}/executions`);
        
        const schedule = await scheduleRepo$.getDocumentById(cmd.scheduleId);
        
        if(!schedule) {
          tools.Logger.log(()=> `[SendMultipleMessagesHandler].execute - Schedule not found: ${JSON.stringify(cmd.scheduleId)}`);
          throw `Schedule not found: ${JSON.stringify(cmd.scheduleId)}`
        }
        
        schedule.successful = response?.usersSent?.map((user)=> user.id);
        schedule.failed = response?.usersFailed?.map((user)=> user.id);
        
        const executionEntry = {
          id: Date.now().toString(),
          successful: schedule.successful,
          failed: schedule.failed,
          dateExecuted: new Date()
        }
        
        await executionsRepo$.create(executionEntry, executionEntry.id);
        
        await scheduleRepo$.update(schedule);
        tools.Logger.log(()=> `[SendMultipleMessagesHandler].execute - Update schedule successful`);
      }
      
      tools.Logger.log(()=> `[SendMultipleMessagesHandler].execute - Send messages complete: ${JSON.stringify(response)}`);

    } catch (error) {
      tools.Logger.error(()=> `[SendMultipleMessagesHandler].execute - Encountered error: ${JSON.stringify(error)}`);
      
      return { attempted: 0, error} as SendMultipleMessagesResp
    }
  }

  private async _sendMessages(msgToSend: SendMultipleMessagesReq, tools: HandlerTools)
  {
    let count = 0;
    const successfulUsers: EnrolledEndUser[] = [];
    const failedUsers: EnrolledEndUser[] = [];

    const scheduledMessages$ = tools.getRepository<ScheduledMessage>(`orgs/${msgToSend.orgId}/scheduled-messages`);

    const scheduled = await scheduledMessages$.getDocuments(new Query().where("objectID", "==", msgToSend.message.id));

    const message: TemplateMessage = {
      ...msgToSend.message,
      n: msgToSend.n,
      type: MessageTypes.TEMPLATE,
      direction: MessageDirection.FROM_AGENT_TO_END_USER
    };

    const sendMessage = new SendOutgoingMsgHandler();

    for (const user of msgToSend.enroledEndUsers) {
      const contactID = user.platformDetails ? user.platformDetails[msgToSend.plaform].contactID : user.phoneNumber;

      if (msgToSend.plaform === PlatformType.WhatsApp) {
        message.endUserPhoneNumber = contactID;
      } else if (msgToSend.plaform === PlatformType.Messenger) {
        message.receipientId = contactID;
      }

      const resp = await sendMessage.execute(message, null, tools);

      if(resp.success) {
        successfulUsers.push(user);
      } else {
        failedUsers.push(user);
      }
      count++;
    }

    return {
      attempted: count,
      usersSent: successfulUsers,
      usersFailed: failedUsers
    } as SendMultipleMessagesResp;

  }
}