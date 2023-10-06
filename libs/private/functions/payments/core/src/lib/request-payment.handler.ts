import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";
import { IObject } from "@iote/bricks";

import { PaymentCoreService } from "./services/payment-core.service";
import { Invoice } from './models/invoice';

export class RequestPaymentHandler extends FunctionHandler<Invoice, any>
{
  /**
   * function to request a payment from a one time user, returns a url that when clicked checksout to Mollie's payments page
   */
  private _paymentService: PaymentCoreService;
  public async execute(data: Invoice, context: FunctionContext, tools: HandlerTools): Promise<any> {
    try {
      const payment = {
        description: data.description,
        redirectUrl: "http://localhost:4200/setting",
        cancelUrl: "http://localhost:4200/home",
        amount: {
          currency: data.amount.currency,
          value: data.amount.value
        },
        method: ['creditcard']
      };

      tools.Logger.log(() => `execute: Payment Obj => ${JSON.stringify(payment)}`)

      this._paymentService = new PaymentCoreService("test_RTxqmDAhRdfWncsEuHRW6pgbAW6yNs", payment, "https://api.mollie.com/v2/payments", tools)

      const paymentResponse = await this._paymentService.requestPayment();

      const responseBody = JSON.parse(JSON.stringify(paymentResponse));

      const paymentUrl = responseBody['_links']['checkout']['href'];

      const paymentRepo = tools.getRepository<PaymentData>('payments');

      await paymentRepo.write(responseBody as unknown as PaymentData, responseBody.id);

      // Log the checkout URL
      tools.Logger.log(() => `execute: Payment URL: ${paymentUrl}`);

      // Return the response body from mollie
      return responseBody;

    } catch (e) {
      tools.Logger.log(() => e)
    }
  }

}

interface PaymentData extends IObject {
  resource: string;
  id: string;
  mode: string;
  createdAt: string;
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  method: string;
  metadata: null | any; // You can replace 'any' with a more specific type if needed
  status: string;
  isCancelable: boolean;
  expiresAt: string;
  profileId: string;
  sequenceType: string;
  redirectUrl: string;
  cancelUrl: string;
  _links: {
    self: {
      href: string;
      type: string;
    };
    checkout: {
      href: string;
      type: string;
    };
    dashboard: {
      href: string;
      type: string;
    };
    documentation: {
      href: string;
      type: string;
    };
  };
}

