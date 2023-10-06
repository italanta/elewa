import { HandlerTools } from "@iote/cqrs";
import { IObject } from "@iote/bricks";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";

import { Subscription } from "./models/subscription";
import { SubscriptionService } from "./services/subscription-core.service";
import createMollieClient from "@mollie/api-client";

export class CreateSubscriptionsHandler extends FunctionHandler<Subscription, any>
{
  /**
   * function that creates subscriptions using the mollie createSubscription suite
   */
  private _subService: SubscriptionService;
  
  public async execute(data: Subscription, context: FunctionContext, tools: HandlerTools): Promise<any> {
    
    try {
      const subscription: Subscription = {
        description: data.description,
        amount: {
          currency: data.amount.currency,
          value: data.amount.value
        },
        interval: '12 months',
        status: "",
        orgId: "",
        startDate: '2023-10-06',
        method: 'creditcard'
        
      };

      tools.Logger.log(() => `execute: Payment Obj => ${JSON.stringify(subscription)}`)
      tools.Logger.log(() => `execute: Got here`)

      // this._subService = new SubscriptionService(subscription, "test_RTxqmDAhRdfWncsEuHRW6pgbAW6yNs", tools)


      const paymentResponse = await createCustomerSubscription(tools);

      tools.Logger.log(() => `execute: Got here`)

      const responseBody = paymentResponse;

      tools.Logger.log(() => `execute: sub: responseBody}`);

      const paymentUrl = responseBody['_links']['customer']['href'];

      const paymentRepo = tools.getRepository<SubscriptionData>('client-subscriptions');

      await paymentRepo.write(responseBody as unknown as SubscriptionData, responseBody.id);

      // Log the checkout URL
      tools.Logger.log(() => `execute: Payment URL: ${paymentUrl}`);

      // Return the response body from mollie
      return responseBody;

    } catch (e) {
      tools.Logger.log(() => e)
    }
  }

}

async function createCustomerSubscription(tools: HandlerTools) {
  tools.Logger.log(() => `execute: Got here createCustomerSubscription`)

  const mollieClient = createMollieClient({ apiKey: 'test_RTxqmDAhRdfWncsEuHRW6pgbAW6yNs' });
  return await mollieClient.customerSubscriptions.create(this.sub);
}

interface SubscriptionData extends IObject{
  resource: string;
  id: string;
  mode: string;
  createdAt: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  method: null | string;
  times: number;
  interval: string;
  startDate: string;
  webhookUrl: string;
  nextPaymentDate: string;
  metadata: {
    order_id: string;
  };
  _links: {
    self: {
      href: string;
      type: string;
    };
    customer: {
      href: string;
      type: string;
    };
  };

}

