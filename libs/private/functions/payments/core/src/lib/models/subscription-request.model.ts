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

/**
 * SubscriptionReq
 * 
 * "userId": "",
        "sequencyType": "first",
        "interval": "12 months",
        "description": "first sub from postman",
        "amount": {
            "currency": "USD",
            "value": "45.00"
        }
 */