import { Message } from "@app/model/convs-mgr/conversations/messages";

import { IObject } from "@iote/bricks";

/** Stores the general state of the bot. TODO: Add other properties */
export interface BotState extends IObject {
  lastMessage: Message;
}