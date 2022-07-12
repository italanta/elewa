import { Roles } from '@iote/bricks';

/** Roles for non-admins determined by a *-* relation on org level. */
export interface iTalUserRoles extends Roles
{
  access: boolean;
  admin: boolean;
}
