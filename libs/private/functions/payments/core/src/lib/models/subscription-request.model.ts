import { SubscriptionType } from "./iTal-subscription.model";
import { Amount } from "./payment";

export interface SubscriptionReq {
    userId: string;
    mollieCustomerId?: string;
    interval: string;
    description: string;
    amount: Amount;
    subscriptionType:  SubscriptionType;
}
