import { IObject } from "@iote/bricks";

import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

export interface SendMessageTemplate extends IObject
{
  n: number,


  // TODO: Correct spelling
  plaform: PlatformType;

  message: TemplateMessage,

  /**
   * This can be an array of phone numbers if it's on whatsapp or an array of
   *  recepientIds, on messenger. The unique identifier through which the end user
   *   receives the message.
   */
  endUsers: string[];
}