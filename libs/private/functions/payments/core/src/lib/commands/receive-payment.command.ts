import { Payment, Amount } from "../../../../../../model/payments-models/src/lib/payment";
import { SequenceType } from "../../../../../../model/payments-models/src/lib/sequence-type";

/**
 * Create a new command for handling the payments webhook
 * @see https://docs.mollie.com/reference/v2/payments-api/create-payment
*/
export interface RcvPaymentCommand extends Payment
{ 
    amount: Amount; 
    description: string;
    redirectUrl: string;
    cancelUrl: string;
    webhookUrl?: string;
    sequenceType?: SequenceType;
}
