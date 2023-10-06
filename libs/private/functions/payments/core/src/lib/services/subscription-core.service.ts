//import { Payment } from ;
import { Payment } from "../models/payment";
import axios, { AxiosRequestHeaders } from 'axios';
import { Subscription } from "../models/subscription";
import { HandlerTools } from "@iote/cqrs";
import { createMollieClient } from '@mollie/api-client';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions'

export class SubscriptionService {

  private _subscription: Subscription;
  private _handlerTools: HandlerTools;
  private _subscriptionsRepo;

  private sub: any;

  mollieClient = createMollieClient({ apiKey: this._apiKey });

  constructor(public subscription: Subscription, private _apiKey: string, private tools: HandlerTools) {
    this._subscription = subscription;
    this._subscriptionsRepo = this._handlerTools.getRepository<Subscription>('subscriptions')
  }

  async createCustomerSubscription() {
    this.tools.Logger.log(() => `SubscriptionService : createCustomerSubscription`);
    this.sub = this.subscription;
    return await this.mollieClient.customerSubscriptions.create(this.sub);
  }

  public async createSubscription() {
    const subscriptionDocument = await this._subscriptionsRepo.create(this.subscription);
    return subscriptionDocument;
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