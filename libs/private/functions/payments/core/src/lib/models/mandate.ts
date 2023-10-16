import { IObject } from "@iote/bricks";

export interface Mandate extends IObject {
  method: string;
  consumerName: string;  
  status: MandateStatusTypes;
  mandatesId: string;

}
/**
 * The status that is returned by calling the mollie mandates api
 * @see https://docs.mollie.com/reference/v2/mandates-api/get-mandate
 */
export enum MandateStatusTypes {
  Valid = 'valid',
  Pending = 'pending',
  Invalid = 'invalid'
}