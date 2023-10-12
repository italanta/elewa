import { IObject } from "@iote/bricks";

export interface Mandate extends IObject {
  method: string;
  consumerName: string;  
  status: MandateStatusTypes;
  mandatesId: string;

}

export enum MandateStatusTypes {

}