import { IObject } from "@iote/bricks";
import { Amount } from "./payment";

/**The invoice object depicted in the front end
 * TODO: Check if it will be needed in the future for invoicing
 */
export interface Invoice extends IObject {
    date: Date;
    description: string;
    amount: Amount;
    orgId: string;
}