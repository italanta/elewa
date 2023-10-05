import { Subscription } from "./subscription";

/**
 * The customer id is returned by the customer API and will be saved to db 
 */
export interface Customer {
    customerId:     string
    name:           string;
    email:          string;
    isPremium:      Subscription
}
