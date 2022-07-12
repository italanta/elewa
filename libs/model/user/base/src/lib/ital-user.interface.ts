import { User } from '@iote/bricks';

import { iTalUserProfile } from './app-user-profile.interface';
import { iTalUserRoles } from './app-user-roles.interface';

export interface iTalUser extends User
{
  profile: iTalUserProfile;
  roles:   iTalUserRoles;

  /**
   * Organisations the user has a role in (if not admin)
   *
   * @type {string[]}
   * @memberof EleUser
   */
  orgs: string[];

  /** Active Organisation ID. Users can only have one currently active org.
   *    The active org ID is used to determine which screen to route non-admins too when selecting orgs. */
  activeOrg: string;
}
