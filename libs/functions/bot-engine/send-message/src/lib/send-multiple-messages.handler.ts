import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { ScheduledMessage, SendMessageTemplate } from "@app/model/convs-mgr/functions";
import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";

import { SendOutgoingMsgHandler } from "./send-outgoing-message.handler";

export class SendMultipleMessagesHandler extends FunctionHandler<ScheduledMessage, any>
{
  async execute(cmd: SendMessageTemplate, context: FunctionContext, tools: HandlerTools) 
  {
    return this._sendMessages(cmd, tools);
  }

  private async _sendMessages(msgToSend: SendMessageTemplate, tools: HandlerTools)
  {
    const message: any = {
      ...msgToSend.message,
      n: msgToSend.n
    };

    const sendMessage = new SendOutgoingMsgHandler();

    for (let receieveID of msgToSend.endUsers) {
      if (msgToSend.plaform === PlatformType.WhatsApp) {

        message.endUserPhoneNumber = receieveID;
        await sendMessage.execute(message, null, tools);

      } else if (msgToSend.plaform === PlatformType.Messenger) {
        message.receipientId = receieveID;
        await sendMessage.execute(message, null, tools);

      }
    }

  }
}