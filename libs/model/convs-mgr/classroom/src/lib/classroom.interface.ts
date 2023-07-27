import { IObject } from "@iote/bricks";

export interface Classroom extends IObject {
  className: string;
  description: string;
  deleted: boolean;
}
