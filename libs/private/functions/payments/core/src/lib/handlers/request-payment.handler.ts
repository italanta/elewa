import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { HandlerTools } from "@iote/cqrs";

import { iTalUser } from "@app/model/user";
import { Payment } from "../models/payment";

import { PaymentCoreService } from "../services/payment-core.service";
import { MollieCustomerService } from "../services/customer-core-service";


export class RequestPaymentHandler extends FunctionHandler<any, any>
{
  /**
   * function to request a payment from a one time user, returns a url that when clicked checksout to Mollie's payments page
   */
  private _paymentService: PaymentCoreService;

  public async execute(data: { orgId: string, payment: Payment, userId: string }, context: FunctionContext, tools: HandlerTools): Promise<any> {
    try {
      const mollieDataService = new MollieCustomerService(tools)

      const iTalUser = await mollieDataService.getUser(data.userId)

      this._paymentService = new PaymentCoreService(process.env.MOLLIE_API_KEY, tools)
      /** keeping this here for future proofing incase we need single payments */
      //const paymentResponse  = await this._paymentService.createPayment(data.payment, iTalUser);

      const paymentResponse  = await this._paymentService.onFirstPayment(data.payment, iTalUser);

      const paymentUrl = paymentResponse['_links']['checkout']['href'];

      const paymentRepo = tools.getRepository<Payment>(`orgs/${data.orgId}payments`);

      await paymentRepo.write(paymentResponse as unknown as Payment, paymentResponse.id);

      // Log the checkout URL
      tools.Logger.log(() => `execute: Payment URL: ${paymentUrl}`);

      // Return the checkoutURL
      return paymentUrl

    } catch (e) {
      tools.Logger.log(() => e)
      throw e;
    }
  }

}
