import { Payment } from "../models/payment"
import { Subscription } from "../models/subscription"
import { HandlerTools } from "@iote/cqrs";
import { createMollieClient } from '@mollie/api-client';
import { MollieCustomerService } from "./customer-core-service";

const SUBSCRIPTIONS_COLLECTION = 'subscriptions'

export class SubscriptionService {

  private _subscription: Subscription;
  private _handlerTools: HandlerTools;
  private _subscriptionsRepo;

  mollieClient;

  constructor(private _apiKey: string, private tools: HandlerTools, private mollieClientService: MollieCustomerService) {
    this._subscriptionsRepo = this._handlerTools.getRepository<Subscription>('subscriptions');
    this.mollieClient = createMollieClient({ apiKey: this._apiKey });
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

  async createRecurringPayment(molUserId: string, validMandateId: string, amount: number, interval: string) {  
    if (!validMandateId) {
      throw new Error('No valid mandate found for user');
    }
    
    const recurringPayment = {
      amount: {amount: amount.toString(), currency: "USD"},
      customerId: molUserId,
      sequenceType: "recurring",
      description: "Recurring payment",
      webhookUrl: "https://europe-west1-elewa-clm-test.cloudfunctions.net/receivePayment",
      mandateId: validMandateId,
      interval: interval
    };
    
    const recurringPayentCreated = await this.mollieClient.customerSubscriptions.create(recurringPayment);
    
    return recurringPayentCreated;
  }

  async cancelSubscription() {
    try {
      this._subscription.status = "cancelled";

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
   * Should the status be an enum? 
   */
  async pauseSubscription() {
    try {
      this._subscription.status = "paused";
      await this._subscriptionsRepo.update(this._subscription);

      this._handlerTools.Logger.log(() => `Subscription paused successfully`);

      /**How do i notify user of the pause? */
    } catch (error) {
      console.error("Error pausing subscription:", error);
      throw error;
    }
  }
}