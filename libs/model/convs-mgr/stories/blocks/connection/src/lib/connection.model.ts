import { IObject } from "@iote/bricks";

export interface Connection extends IObject {
  slot: number;
  sourceId: string;
  targetId: string;
}