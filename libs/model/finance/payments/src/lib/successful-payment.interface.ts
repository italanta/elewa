import { Payment } from './payment.interface';

export interface SuccessfulPayment extends Payment
{
  receiptNo: string;
}
