import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { iTalUser } from "@app/model/user";
import { Payment } from "../models/payment";

import { PaymentCoreService } from "../services/payment-core.service";


export class RequestPaymentHandler extends FunctionHandler<any, any>
{
  /**
   * function to request a payment from a one time user, returns a url that when clicked checksout to Mollie's payments page
   */
  private _paymentService: PaymentCoreService;
  private user: iTalUser

  public async execute(data: {orgId: string, payment: Payment}, context: FunctionContext, tools: HandlerTools): Promise<any> {
    try {
      tools.Logger.log(() => `execute: got here`)

      tools.Logger.log(() => `execute: Payment Obj => ${JSON.stringify(data.payment)}`)

      this._paymentService = new PaymentCoreService( process.env.MOLLIE_API_KEY, tools)

      const paymentResponse = await this._paymentService.createPayment(data.payment, this.user );

      const responseBody = JSON.parse(JSON.stringify(paymentResponse));

      const paymentUrl = responseBody['_links']['checkout']['href'];

      const paymentRepo = tools.getRepository<Payment>(`orgs/${data.orgId}payments`);

      const paymentMethod = responseBody.method;

      await paymentRepo.write(responseBody as unknown as Payment, responseBody.id);

      // Log the checkout URL
      tools.Logger.log(() => `execute: Payment URL: ${paymentUrl}`);

      // Return the checkoutURL
      return { paymentData: paymentUrl, paymentMethod: paymentMethod }; 

    } catch (e) {
      tools.Logger.log(() => e)
      throw e;
    }
  }
}
