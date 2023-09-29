import { Timestamp } from "@firebase/firestore-types";

import { IObject } from "@iote/bricks";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, FunctionContext } from "@ngfi/functions";

import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { Message } from "@app/model/convs-mgr/conversations/messages";

export class ScheduleMessages extends FunctionHandler<any, any>
{
  async execute(cmd: any, context: FunctionContext, tools: HandlerTools) 
  {

  }
}