import { IObject } from "@iote/bricks";
 
export interface CLMSubscription extends IObject{
    subscriptionType?:    SubscriptionType;
    startDate:            Date;
    expiryDate:           Date;
    interval:             IntervalTypes;
    status:               SubscriptionStatusTypes;  
}
 
export enum SubscriptionStatusTypes {
    Cancelled  = 'cancelled',
    Pending    = 'pending',
    Active     = 'active',
    Paused     = 'paused'
}
 
export enum IntervalTypes {
    Monthly = '1 month',
    Quarterly = '3 months',
    Annually = '12 months'
}
 
export enum SubscriptionType {
    BASIC = 1,
    STANDARD = 2,
    ENTERPRISE = 3
}