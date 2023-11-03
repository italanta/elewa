import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { iTalUser } from "@app/model/user";
import { Customer } from "../models/customer";
import { SubscriptionReq } from "../models/subscription-request.model";

import { MollieCustomerService } from "../services/customer-core-service";
import { SubscriptionService } from "../services/subscription-core.service";

import { TransactionsService } from "../services/transaction.service";
import { Transaction, TransactionStatus } from "../models/transaction";

/**
 * Handles the creation of subscriptions based on incoming data.
 * provide webhook url on first payment request, help in getting a confirmation for a successful payment 
 */
export class CreateSubscriptionsHandler extends FunctionHandler<SubscriptionReq, any> {
  private mollieCustomerService: MollieCustomerService;
  private subscriptionService: SubscriptionService;
  private iTalUser: iTalUser;
  private customer: Customer;
  private _trnService: TransactionsService;
  private mollieCustomerId: string;

   /**
   * The entry point for handling subscription creation.
   * @param data - Subscription request data.
   * @param context - Function execution context.
   * @param tools - Handler tools for logging and interactions.
   * @returns The result of the subscription creation or a URL for the first payment.
   * @see https://docs.mollie.com/reference/v2/subscriptions-api/create-subscription
   */

  async execute(data: SubscriptionReq, context: FunctionContext, tools: HandlerTools): Promise<any> {

    tools.Logger.log(() => `[CreateSubscriptionsHandler].execute - Payload :: ${JSON.stringify(data)}`);

    this.mollieCustomerService = new MollieCustomerService(tools);
    this.subscriptionService = new SubscriptionService(tools);
    this._trnService = new TransactionsService(tools);

    // Get user details
    this.iTalUser = await this.mollieCustomerService.getUser(data.userId)
    this.mollieCustomerId = this.iTalUser.mollieCustomerId as string;

    try {
      //Check if the customer is not on Mollie, create them, and update the user object with the Mollie customer ID
      if (!this.mollieCustomerId) {
        const mollieCustomerId = await this.mollieCustomerService.createMollieCustomer(this.iTalUser);
        this.mollieCustomerId = mollieCustomerId;
        this.iTalUser.mollieCustomerId = mollieCustomerId;

        await this.mollieCustomerService.updateUser(this.iTalUser);
      }
      //Check if the customer has a valid mandate (permission for recurring payments)
      const hasMandate = await this.mollieCustomerService._getValidMandate(this.iTalUser);
      //Define subscription details based on incoming data
      const subDetails = { amount: data.amount.value, interval: data.interval }
      if (hasMandate) {
        const subscriptionResponse = await this.subscriptionService.createRecurringPayment(this.mollieCustomerId, hasMandate, subDetails);
        // Log the subscription response
        tools.Logger.log(() => `Subscription Created: ${JSON.stringify(subscriptionResponse)}`);
        //Create a transaction and update its status to 'pending'
        const trn: Transaction = {
          id: subscriptionResponse.id,
          amount: data.amount.value,
          orgId: this.iTalUser.activeOrg,
          date: new Date(),
          status: TransactionStatus.pending
        }
        await this._trnService.writeTransaction(trn, this.iTalUser.id as string)

        return this.subscriptionService.initSubscription(subscriptionResponse, data.subscriptionType, this.iTalUser.activeOrg);

      } else {
        // If the customer does not have a mandate, create the first payment and return a URL to complete it
        const firstPaymentUrl = await this.subscriptionService.createFirstPayment(this.mollieCustomerId);
        tools.Logger.log(() => `First Payment URL: ${firstPaymentUrl}`);

        return firstPaymentUrl;
      }
    } catch (error) {
      // Handle any errors that occur during the process
      tools.Logger.log(() => `Subscription Creation Error: ${error}`);
      throw error;
    }
  }
}

