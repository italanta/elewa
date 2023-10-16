import { IObject } from "@iote/bricks";
import { Amount } from "./payment";

/**
 * Interval takes types monthy, weekly, yearly
 * @see https://docs.mollie.com/payments/recurring on how to handle recurring payments
 */
export interface Subscription extends IObject{
    amount:            Amount;
    interval:          string;
    description:       string;
    orgId:             string;
    webhookUrl:        string;
    customerId:        string;
    sequenceType:      string;
    
}
 