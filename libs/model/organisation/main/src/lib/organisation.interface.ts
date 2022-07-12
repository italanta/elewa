import { IObject } from '@iote/bricks';

import { Address } from './address.interface';
import { Contact } from './contact.interface';

export interface Organisation extends IObject
{
  name: string;

  address?: Address;
  contact?: Contact;
}
