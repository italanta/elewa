import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { PaymentCoreService } from "../services/payment-core.service";
// import createMollieClient from '@mollie/api-client';

export class ReceivePaymentHandler extends FunctionHandler<any, any>
{
  private _paymentService: PaymentCoreService;
  private tools: HandlerTools;

  public async execute(data: any, context: FunctionContext, tools: HandlerTools): Promise<any> {
    /**
     * The webhook that is sent to mollie so as to update on payment status.
     */
    
    tools.Logger.log(() => `Payment Object ${JSON.stringify(data)}`);
  }

 }
