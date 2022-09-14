import { IObject } from "@iote/bricks";

export interface DefaultBlock extends IObject{
  id: string;
  nextBlock: string;
}