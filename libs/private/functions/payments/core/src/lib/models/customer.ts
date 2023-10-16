import { IObject } from "@iote/bricks";

/**
 * The customer id is returned by the customer API and will be saved to db 
 */
export interface Customer extends IObject {
    customerId?:     string
    name:           string;
    email:          string;
}
