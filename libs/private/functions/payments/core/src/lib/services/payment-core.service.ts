import { createMollieClient } from '@mollie/api-client';
import { HandlerTools } from '@iote/cqrs';

import { iTalUser } from '@app/model/user';

import { Payment } from "../models/payment";
import { Mandate } from '../models/mandate';

import { MollieCustomerService } from './customer-core-service';


export class PaymentCoreService {
    private mollieCustomerService: MollieCustomerService;
    private mollieClient;
  //  private customerId: iTalUser;

  /**
   * Constructor to initialize the service with the Mollie API key.
   * @param apiKey - The Mollie API key for authentication.
   * @param tools - HandlerTools for logging and other utility functions.
   */
  constructor(private _apiKey: string, private tools: HandlerTools) {
    this._apiKey = process.env.MOLLIE_API_KEY;
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
    this.mollieCustomerService = new MollieCustomerService( tools)
  }

  /**
   * Create a payment and return the payment details.
   * @param payment - Payment details including amount, currency, and description.
   * @param user - The user associated with the payment.
   * @returns The details of the created payment.
   * @throws Error if creating the payment fails.
   */
  async createPayment(payment: Payment, user: iTalUser) {
    try {
      // TODO: Pass the actual user while using this method

      const customerId = getCustomerID(user, this.mollieCustomerService)
  
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
      this.tools.Logger.error(() => error.message)
      // Handle errors gracefully by throwing a specific error message
      throw new Error('Failed to create payment');
    }
  }
  /**
   * Handle the first payment and update user information.
   * @param payment - Payment details for the first payment.
   * @param user - The user associated with the payment.
   * @returns The updated user with mandate information.
   */
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
    // Update user in the repo
    const usersRepo$ = this.tools.getRepository<iTalUser>('users');

    return usersRepo$.update(user);
  }

  /**
   * Get payment details for a given payment ID.
   * @param paymentId - The ID of the payment to retrieve details, returned by mollie api
   * @returns The payment details for the specified payment ID.
   */
  async getPaymentDetails(paymentId: string){
    const molliePaymentStatus = await this.mollieClient.payments.get(paymentId) 
    return molliePaymentStatus;
  }
       
  private updateSubscription(){
    /** TODO */
  }
}

/** get/create a user's mollie customer id */
async function getCustomerID(user: iTalUser, mollieCustomerDataServ: MollieCustomerService) {
  if (user.mollieCustomerId) {
    return user.mollieCustomerId
  }

  user.mollieCustomerId = await this.mollieCustomerService.createMollieCustomer(user);

  const newUser = await mollieCustomerDataServ.updateUser(user);

  return newUser.mollieCustomerId;
}