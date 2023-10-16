import { createMollieClient } from '@mollie/api-client';
import { HandlerTools } from "@iote/cqrs";

import { Status, Subscription } from "../models/subscription"

import { environment } from "../../environments/environment";

const SUBSCRIPTIONS_COLLECTION = 'subscriptions'

export class SubscriptionService {

  private _subscription: Subscription;
  private _handlerTools: HandlerTools;
  private _subscriptionsRepo;
  private mollieClient;

  constructor() {
    this._subscriptionsRepo = this._handlerTools.getRepository<Subscription>('subscriptions');
    this.mollieClient = createMollieClient({ apiKey: environment.mollieApiKey });
  }

  async createFirstPayment(molUserId: string) {
    const firstPayment = {
      amount: {
        currency: "USD",
        value: "0.01"
      },
      customerId: molUserId,
      sequenceType: "first",
      description: "First payment",
      redirectUrl: "https://app.goomza.co/",
      webhookUrl: "https://europe-west1-elewa-clm-test.cloudfunctions.net/receivePayment",
      method: 'creditcard',
    };
    const payment = await this.mollieClient.customerPayments.create(firstPayment);
    
    return payment;
  }

  async createRecurringPayment(molUserId: string, validMandateId: string, subDetails: {amount: number, interval: string} ) {  
    if (!validMandateId) {
      throw new Error('No valid mandate found for user');
    }
    
    const recurringPayment = {
      amount: {amount: subDetails.amount.toString(), currency: "USD"},
      customerId: molUserId,
      sequenceType: "recurring",
      description: "Recurring payment",
      webhookUrl: "https://europe-west1-elewa-clm-test.cloudfunctions.net/receivePayment",
      mandateId: validMandateId,
      interval: subDetails.interval
    };
    
    const recurringPayentCreated = await this.mollieClient.customerSubscriptions.create(recurringPayment);
    
    return recurringPayentCreated;
  }
  
  async getPaymentStatus(paymentId: string){
    const molliePaymentStatus = await this.mollieClient.payment.get(paymentId) //**shaky on userId here, (payment will have userId) */
    return molliePaymentStatus
  }

  async cancelSubscription() {
    try {
      this._subscription.status = Status.Cancelled;

      // Delete the subscription document from the database
      await this._subscriptionsRepo.delete(this._subscription.id);

      this._handlerTools.Logger.log(() => `Cancel subsceription triggered`)

    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }

  }

  /**
   * Update the subscription document in the database with status paused
   */
  async pauseSubscription() {
    try {
      this._subscription.status = Status.Paused
      await this._subscriptionsRepo.update(this._subscription);

      this._handlerTools.Logger.log(() => `Subscription paused successfully`);

      /**How do i notify user of the pause? */
    } catch (error) {
      console.error("Error pausing subscription:", error);
      throw error;
    }
  }
}