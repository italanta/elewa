import { IObject } from "@iote/bricks";

/** Represents a classroom/userGroup */
export interface Classroom extends IObject {
  /** The name of the classroom */ 
  className: string;

  /** A brief description of the classroom */
  description: string;

  /** A boolean flag indicating whether the classroom has been deleted */
  deleted: boolean;
};
