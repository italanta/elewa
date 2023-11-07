import { SubscriptionType } from "./clm-subscription.interface";
import { Amount } from "./payment.interface";

 
export interface SubscriptionReq {
    userId: string;
    mollieCustomerId?: string;
    interval: string;
    description: string;
    amount: Amount;
    subscriptionType:  SubscriptionType;
}