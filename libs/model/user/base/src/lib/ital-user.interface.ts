import { User } from '@iote/bricks';

import { iTalUserProfile } from './ital-user-profile.interface';
import { iTalUserRoles } from './ital-user-roles.interface';

export interface iTalUser extends User
{
  profile: iTalUserProfile;

  /** TODO: @LemmyMwaura - improve typesafety 
   * roles in any organisation is dynamically generated so leaving this as any for now.
  */
  roles:   any;

  /**
   * Organisations the user has a role in (if not admin)
   *
   * @type {string[]}
   * @memberof EleUser
   */
  orgIds: string[];

  /** Active Organisation ID. Users can only have one currently active org.
   *    The active org ID is used to determine which screen to route non-admins too when selecting orgs. */
  activeOrg: string;
}
