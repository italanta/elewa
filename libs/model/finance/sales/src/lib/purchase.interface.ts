import { IObject } from '@iote/bricks';

export interface Purchase extends IObject
{
  /** ID of the chat purchasing the account */
  userId: string;

  /** Contact Information of person purchasing. */
  contacts: {
    /** Client Name */
    name: string;
    /** Client phone */
    phone: string;
  }

  /** purchaseId */
  itemId: string;
  info: {
    code: string;
    label: string;
    _cb: string;
    price: number;
  }

  /** Amount */
  amount: number;
  /** VAT */
  vat: number;
}
