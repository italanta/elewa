import { UserProfile } from '@iote/bricks';

export interface iTalUserProfile extends UserProfile
{
  email: string;
  phone: string;
}
