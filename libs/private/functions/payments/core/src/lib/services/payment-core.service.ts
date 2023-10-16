import { createMollieClient } from '@mollie/api-client';

import { iTalUser } from '@app/model/user';
import { Payment } from "../models/payment"
import { MollieCustomerService } from './customer-core-service';
import { environment } from '../../environments/environment';


export class PaymentCoreService {
    private mollieCustomerService: MollieCustomerService;
    private mollieClient;
    private mlcustomer: iTalUser;
  constructor(private _apiKey: string) {
    this._apiKey = environment.mollieApiKey;
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
  }

  async createPayment(payment: Payment, userId: string) {
    try {
        const customerId = await this.mollieCustomerService.createMollieCustomer(userId);
      if (!payment.customerId || !payment.sequenceType || !payment.description || !payment.amount.currency || !payment.amount.value) {
        throw new Error("Missing required payment information");
      }

      const paymentData = {
        ...payment,
        amount: {
          currency: payment.amount.currency,
          value: payment.amount.value,
        },
        description: payment.description,
        sequenceType: payment.sequenceType,
        redirectUrl: payment.redirectUrl || '',
      };

      const molliePayment = await this.mollieClient.customerPayments.create(paymentData, customerId);

      return molliePayment;
    } catch (error) {
      throw new Error('Failed to create payment');
    }
  }
        /**
         * TODO
         */
    private updateSubscription(){
      //update status in db, aka handler ish
      //get an internal subscription interface with sstatus which can be active, expired, cancelled
      //definitely expiry and start date , dateType extends IObject
      // subscription param: standard, premimum, enterprise enums of course
      //orgs/id/subscriptions: DB path .... new doc, collection of documents
    }
}
