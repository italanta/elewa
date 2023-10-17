import { createMollieClient } from '@mollie/api-client';

import { HandlerTools } from "@iote/cqrs";
import { Query } from '@ngfi/firestore-qbuilder';

import { Subscription } from "../models/subscription"

import { environment } from "../../environments/environment";
import { Transaction } from '../models/transaction';
import { CLMSubscription, SubscriptionStatusTypes, SubscriptionType } from '../models/iTal-subscription.model';

export class SubscriptionService {

  private _subscription: CLMSubscription;
  private _handlerTools: HandlerTools;
  private _subscriptionsRepo;
  private mollieClient;

  constructor(tools: HandlerTools) {
    this._handlerTools = tools;
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

  /**
   * On Mollie
   */
  async createRecurringPayment(molUserId: string, validMandateId: string, subDetails: {amount: string, interval: string} ) {  
    if (!validMandateId) {
      throw new Error('No valid mandate found for user');
    }
    
    const recurringPayment = {
      amount: {value: subDetails.amount, currency: "USD"},
      customerId: molUserId,
      description: "Recurring payment",
      webhookUrl: "https://europe-west1-elewa-clm-test.cloudfunctions.net/receivePayment",
      mandateId: validMandateId,
      interval: subDetails.interval
    };
    console.log(recurringPayment)

    const recurringPayentCreated = await this.mollieClient.customerSubscriptions.create(recurringPayment);
    
    return recurringPayentCreated;
  }
  
  async getPaymentStatus(paymentId: string){
    const molliePaymentStatus = await this.mollieClient.payment.get(paymentId) 
    return molliePaymentStatus
  }

  async cancelSubscription() {
    try {
      this._subscription.status = SubscriptionStatusTypes.Cancelled;

      // Delete the subscription document from the database
      await this._subscriptionsRepo.delete(this._subscription.id);

      this._handlerTools.Logger.log(() => `Cancel subsceription triggered`)

    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }

  }

  /**
   * For first time subscriptions on our side
   */
  async initSubscription(subscriptionReponse: any, subType: SubscriptionType, orgId: string) 
  {
    const subscriptionRepo$ = this._handlerTools.getRepository<CLMSubscription>(`orgs/${orgId}/subscriptions`);

    const newSub: CLMSubscription = {
      startDate: new Date(subscriptionReponse.startDate),
      expiryDate: new Date(subscriptionReponse.nextPaymentDate),
      interval: subscriptionReponse.interval,
      status: SubscriptionStatusTypes.Pending
    }

    return subscriptionRepo$.create(newSub);
  }

  /**
   * For recurring subscriptions on our side
   * 
   * We only set the subscription to active when the payment goes through
   */
  async renewSubscription(trn: Transaction, payment: any) 
  {
    let subscription: CLMSubscription;

    const subscriptionRepo$ = this._handlerTools.getRepository<CLMSubscription>(`orgs/${trn.orgId}/subscriptions`);

    const pendingSub  = (await subscriptionRepo$.getDocuments(new Query().where('status', '==', 'pending')))[0];
    
    if(pendingSub) {
      subscription = {
        ...pendingSub,
        status: SubscriptionStatusTypes.Active
      }
    } else {
      const currentSub  = (await subscriptionRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1)))[0];

      const interval = currentSub.interval;
      const [duration, unit] = interval.split(' ');
      const startDate = new Date();
      const expiryDate = new Date(startDate);

      if (unit == 'months'){
        expiryDate.setMonth(currentSub.startDate.getMonth()+ parseInt(duration))
      }
      subscription = {
        ...currentSub,
        // TODO: Calculate the expiry date from interval and new date
        // ---Important
        startDate: startDate,
        expiryDate: expiryDate,
        status: SubscriptionStatusTypes.Active
      }
    }

    return subscriptionRepo$.update(subscription);
  }

  /**
   * Update the subscription document in the database with status paused
   */
  async pauseSubscription() {
    try {
      this._subscription.status = SubscriptionStatusTypes.Paused
      await this._subscriptionsRepo.update(this._subscription);

      this._handlerTools.Logger.log(() => `Subscription paused successfully`);

      /**How do i notify user of the pause? */
    } catch (error) {
      console.error("Error pausing subscription:", error);
      throw error;
    }
  }
}