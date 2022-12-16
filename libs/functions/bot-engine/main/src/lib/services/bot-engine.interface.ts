import { EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { Message } from "@app/model/convs-mgr/conversations/messages";
export interface IBotEngine
{
  play: (message: Message, endUser: EndUser, endUserPosition?: EndUserPosition) => void;
}