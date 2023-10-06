import { Amount } from "../models/payment";
import { SequenceType } from "../models/sequence-type";

/**
 * Create a new command for handling the payments webhook
 * @see https://docs.mollie.com/reference/v2/payments-api/create-payment
*/
export interface RcvPaymentCommand 
{ 
    amount: Amount; 
    description: string;
    redirectUrl: string;
    cancelUrl: string;
    webhookUrl?: string;
    sequenceType?: SequenceType;
}
