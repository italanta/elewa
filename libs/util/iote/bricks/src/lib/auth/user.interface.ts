import { IObject } from '../db/i-object.interface';

import { Roles } from './roles.interface';
import { UserProfile } from './user-profile.interface';

export interface User extends IObject
{
  uid: string;
  email: string;

  roles: Roles;

  photoUrl?: string;
  displayName?: string;

  profile: UserProfile;
}
