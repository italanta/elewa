import { IObject } from "@iote/bricks";

import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

export interface SendMultipleMessagesReq extends IObject
{
  n: number,

  // TODO: Correct spelling
  plaform: PlatformType;

  message: TemplateMessage,

  /**
   * This is an array of the endusers ids who we are about to send the messsage to
   */
  endUserIds: string[];
}