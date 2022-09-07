import { IObject } from "@iote/bricks";

export interface DefaultBlock extends IObject{
  blockId: string;
  nextBlock: string;
}