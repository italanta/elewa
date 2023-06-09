import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';

/** Represents details about an end user.*/
export interface EndUserDetails {
  /** The user.*/
  user: EndUser;

  /** The user's name.*/
  name: any;

  /** The user's list of cursors. */
  cursor: Cursor[];
}
