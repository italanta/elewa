import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
import { RcvPaymentCommand } from "./commands/receive-payment.command";
// import createMollieClient from '@mollie/api-client';

export class ReceivePaymentHandler extends FunctionHandler<RcvPaymentCommand, any>
{
  public async execute(data: RcvPaymentCommand, context: FunctionContext, tools: HandlerTools): Promise<any> {
    const { amount, description, redirectUrl  } = data
    // const mollieClient = createMollieClient({ apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM' });

    // const molliePayment = await mollieClient.payments.create({
    //   amount: {
    //     value: '25.00',
    //     currency: 'EUR'
    //   },
    //   description: 'CLM test payment',
    //   redirectUrl: 'https://www.facebook.com/'
    // })

     // Map the Mollie payment response to your RcvPaymentCommand object
    // const payment: RcvPaymentCommand = {
    //   amount: molliePayment.amount,
    //   description: molliePayment.description,
    //   redirectUrl: molliePayment.redirectUrl || '',
    //   //cancelUrl: molliePayment.cancelUrl,
    //   webhookUrl: molliePayment.webhookUrl,
    //   cancelUrl: ''
    // };

    // tools.Logger.log(() => `Payment Object ${JSON.stringify(payment)}`);

    return ;
  }

 }
