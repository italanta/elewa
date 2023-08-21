import { IObject } from '@iote/bricks';

import { Address } from './address.interface';
import { Contact } from './contact.interface';

export interface Organisation extends IObject
{
  name: string;

  address?: Address;
  contact?: Contact;
  logoUrl?: string;
  users: string[];
  roles: string[];
  permissions: {};

  email?: string;
  phone?: string;

  /** 
   * The archived flag is used to indicate that the organisation is no longer active.
   *  We archive organisations after the last user has left the organisation.
   */
  archived?: boolean;
}