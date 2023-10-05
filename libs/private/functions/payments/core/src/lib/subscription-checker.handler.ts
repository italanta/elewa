import * as moment from 'moment';
import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { Query } from "@ngfi/firestore-qbuilder";

import { RcvPaymentCommand } from "./commands/receive-payment.command";
import { Subscription } from "./models/subscription";
import { Invoice } from "./models/invoice";

export class SubscriptionCheckerHandler extends FunctionHandler<any, Promise<void>> {
  public async execute(data: RcvPaymentCommand, context: FunctionContext, tools: HandlerTools): Promise<any> {
    const subscriptionsRepo = await tools.getRepository('subscriptions');
    
    // Get subscriptions and check which ones are due today
    const preMidnight = moment().startOf('day');
    const postMidnight = moment().endOf('day');
    const subscriptions = await subscriptionsRepo.getDocuments(
      new Query()
        .where('dueDate', '>=', preMidnight.toDate())
        .where('dueDate', '<=', postMidnight.toDate())
    );

    for (const subscription of subscriptions) {
      await this.createInvoice(tools, subscription as Subscription);
    }
  } 
  /**Creating an invoice from the data we get from a subscription, since it knows when it is due */
  async createInvoice(tools: HandlerTools, subscription: Subscription) {
    try {
      // Create a payment document in the payments collection
      const paymentsRepo = await tools.getRepository('payments');

      const invoice: Invoice = {
        amount: subscription.amount,
        date: new Date(),
        description: subscription.description,
        orgId: subscription.orgId,
      };

      await paymentsRepo.create(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  }
}
