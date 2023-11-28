import { IObject } from '@iote/bricks';

/** Represents a classroom/userGroup */
export interface Classroom extends IObject {
  /** The name of the classroom */
  className: string;

  /** A brief description of the classroom */
  description: string;

  /** A boolean flag indicating whether the classroom has been deleted */
  deleted: boolean;
}

/** classroom mode enum - has the different classroom mutations you can perfom on a user */
export enum ClassroomUpdateEnum {
  ChangeClass = 'Change Class',
  AddToClass = 'Add To Class',
}

// TODO: move elsewhere, potentially to DB - to be decided
/** example of a classroom - we use to group ungrouped users (classroom) */
export const defaultClassroom: Classroom = {
  className: 'Not Assigned',
  description: 'the default classroom',
  deleted: false
}
