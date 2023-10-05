import { HandlerTools } from "@iote/cqrs";
import { FunctionContext, FunctionHandler } from "@ngfi/functions";
//import { RcvPaymentCommand } from "./commands/receive-payment.command"; Commented out because this is the same as a payment object 
import { PaymentCoreService } from "./services/payment-core.service";
import { Invoice } from './models/invoice'
import { Payment } from "./models/payment";
import { SequenceType } from "./models/sequence-type";
import { Subscription } from "./models/subscription";

export class RequestPaymentHandler extends FunctionHandler<Invoice, any>
{

  private _paymentService: PaymentCoreService;
  public async execute(data: Invoice, context: FunctionContext, tools: HandlerTools): Promise<any> {
    // Request Payment from Organization
   // const invoiceAmount = this.calculateInvoiceAmount(subscription);
    const payment: Payment = {
        description: data.description,
        redirectUrl: "http://localhost:4200/settings",
        cancelUrl: "http://localhost:4200/home",
        amount: {
            currency: "EUR",
            value: "35.00"
        },
        sequenceType: SequenceType.Recurring
    };
    this._paymentService = new PaymentCoreService("", payment, "https://api.mollie.com/v2/payments")
    const paymentReponse = await this._paymentService.requestPayment();
    const paymentRepo = await tools.getRepository('payments');
    paymentRepo.create(paymentReponse);

    return 
  }

  //Find a way of getting subscriptions from an org 
  calculateInvoiceAmount(subscription: Subscription){
    return subscription.amount.value
  }
}