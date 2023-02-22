import { Timestamp } from '@firebase/firestore-types';
import { Payment } from './payment.interface';

export interface FailedPayment extends Payment
{
  reasonFail :
  {
    code: 'wrong_number' | 'insufficient_funds';
    message: string;
    failTime: Timestamp | Date;
  }
}
