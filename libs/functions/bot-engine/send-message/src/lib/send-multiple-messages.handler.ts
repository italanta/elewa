import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { MessageTypes } from "@app/model/convs-mgr/functions";
import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { MessageDirection, TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

import { SendOutgoingMsgHandler } from "./send-outgoing-message.handler";
import { SendMultipleMessagesResp } from "./models/send-multiple-messages-rep.interface";
import { SendMultipleMessagesReq } from "./models/send-multiple-messages-req.interface";

export class SendMultipleMessagesHandler extends FunctionHandler<SendMultipleMessagesReq, SendMultipleMessagesResp>
{
  async execute(cmd: SendMultipleMessagesReq, context: FunctionContext, tools: HandlerTools) 
  {
    try {
      
      return this._sendMessages(cmd, tools);
    } catch (error) {
      tools.Logger.error(()=> `[SendMultipleMessagesHandler].execute - Encountered error: ${JSON.stringify(error)}`);

      return { attempted: 0, error} as SendMultipleMessagesResp
    }
  }

  private async _sendMessages(msgToSend: SendMultipleMessagesReq, tools: HandlerTools)
  {
    let count = 0;
    const successfulUsers: string[] = [];
    const failedUsers: string[] = [];

    const message: TemplateMessage = {
      ...msgToSend.message,
      n: msgToSend.n,
      type: MessageTypes.TEMPLATE,
      direction: MessageDirection.FROM_AGENT_TO_END_USER
    };

    const sendMessage = new SendOutgoingMsgHandler();

    for (const endUserId of msgToSend.endUserIds) {
      const contactID = endUserId.split('_')[2];

      if (msgToSend.plaform === PlatformType.WhatsApp) {
        message.endUserPhoneNumber = contactID;
      } else if (msgToSend.plaform === PlatformType.Messenger) {
        message.receipientId = contactID;
      }

      const resp = await sendMessage.execute(message, null, tools);

      if(resp.success) {
        successfulUsers.push(message.endUserPhoneNumber || message.receipientId);
      } else {
        failedUsers.push(message.endUserPhoneNumber || message.receipientId);
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