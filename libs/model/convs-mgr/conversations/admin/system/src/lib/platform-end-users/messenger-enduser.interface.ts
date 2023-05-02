import { EndUser } from "@app/model/convs-mgr/conversations/chats";

export interface MessengerEndUser extends EndUser {
  /**
   * This is a page scoped id for the end user given by Messenger
   *  and required to send and receive messages on Messenger endpoints
   */
    endUserPageId: string;
}