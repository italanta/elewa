import { createMollieClient } from '@mollie/api-client';

import { iTalUser } from '@app/model/user';
import { HandlerTools } from '@iote/cqrs';

import { MollieCustomerService } from './customer-core-service';
import { Payment } from "../models/payment";

import { Customer } from '../models/customer'
import { Mandate } from '../models/mandate';


export class PaymentCoreService {
    private mollieCustomerService: MollieCustomerService;
    private mollieClient;
    private mlcustomer: iTalUser;
    private customer: Customer

  constructor(private _apiKey: string, private tools: HandlerTools) {
    this._apiKey = process.env.MOLLIE_API_KEY;
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
    this.mollieCustomerService = new MollieCustomerService(this.customer, this._apiKey, tools)
  }

  async createPayment(payment: Payment, user: iTalUser) {
    try {
      // TODO: Pass the actual user while using this method
      const customerId = await this.mollieCustomerService.createMollieCustomer(user);
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
    const molliePaymentStatus = await this.mollieClient.payments.get(paymentId) 
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
