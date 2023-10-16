import { createMollieClient } from '@mollie/api-client';

import { iTalUser } from '@app/model/user';
import { Payment } from "../models/payment"
import { MollieCustomerService } from './customer-core-service';
import { environment } from '../../environments/environment';
import { Mandate, MandateStatusTypes } from '../models/mandate';
import { HandlerTools } from '@iote/cqrs';


export class PaymentCoreService {
    private mollieCustomerService: MollieCustomerService;
    private mollieClient;
    private mlcustomer: iTalUser;

  constructor(private _apiKey: string, private tools: HandlerTools) {
    this._apiKey = environment.mollieApiKey;
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
  }

  async createPayment(payment: Payment, user: iTalUser) {
    try {
      // TODO: Pass the actual user while using this method
        const customerId = await this.mollieCustomerService.createMollieCustomer(user);
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

  async onFirstPayment(payment: any, user: iTalUser) 
  {
    const mandateId = payment.mandateId;
    const mollClient = createMollieClient({ apiKey: this._apiKey });

    const mandateDetails = await mollClient.customerMandates.get(mandateId, {customerId: payment.customerId});

    const newMandate: Mandate = {
      id: mandateId,
      status: mandateDetails.status as any,
      method: mandateDetails.method,
    } 

    if(!user.mandates || user.mandates.length < 1) {
      user.mandates = [newMandate];
    } else {
      user.mandates.push(newMandate);
    }

    // Update user
    const usersRepo$ = this.tools.getRepository<iTalUser>('users');

    return usersRepo$.update(user);
  }

  async getPaymentDetails(paymentId: string){
    const molliePaymentStatus = await this.mollieClient.payment.get(paymentId) //**shaky on userId here, (payment will have userId) */
    return molliePaymentStatus;
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
