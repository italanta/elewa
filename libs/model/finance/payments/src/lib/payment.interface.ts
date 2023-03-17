import { Timestamp } from '@firebase/firestore-types';

import { IObject } from '@iote/bricks';

import { CatalogueItem } from '@app/model/finance/sales';

import { PaymentStatus } from './payment-status.enum';

export interface Payment extends IObject
{
  chatId: string;
  amount: number;
  purchase: CatalogueItem;

  timestamp: Timestamp | Date;

  status: PaymentStatus;

  customerName: string;
  customerPhone: string;

  // MPesa Request Processing
  ref: string;
  reqData: any;
  // Full Mpesa transcript
  resp?: any;
}

