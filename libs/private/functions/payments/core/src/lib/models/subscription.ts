import { IObject } from "@iote/bricks";
import { Amount } from "./payment";

/**
 * Interval takes types monthy, weekly, yearly
 * @see https://docs.mollie.com/payments/recurring on how to handle recurring payments
 */
export interface Subscription extends IObject{
    status:            Status;
    amount:            Amount;
    interval:          string;
    times?:            number;
    description:       string;
    orgId:             string;
    startDate:         string;
    expiryDate:        string;  
    method:            string;
    webhookUrl:        string;
    customerId:        string;
    sequenceType:      string;
    subscriptionType?:  SubscriptionType;
}
 export enum Status{
   Cancelled  = 'cancelled',
   Pending    = 'pending',
   Active     = 'active',
   Paused     = 'paused'
 }

 export enum SubscriptionType {
    BASIC = 1,
    STANDARD = 2,
    ENTERPRISE = 3
 }