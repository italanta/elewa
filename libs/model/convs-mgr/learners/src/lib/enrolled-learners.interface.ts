import { IObject } from "@iote/bricks";


/**
 * Represents an enrolled learner.
 */
export interface EnrolledEndUser extends IObject {
  /**
   * The name of the enrolled learner.
   */
  name: string;

  /**
   * The phone number of the enrolled learner.
   */
  phoneNumber: string;

  /**
   * The ID of the class to which the learner is enrolled.
   */
  classId: string;

  /**
   * The current course that a learner is in.
   */
  currentCourse: string;

  /**
   * Optional field to link to the whatsappend-userId collection using their ID.
   */
  whatsappUserId?: string;

  /**
   * Optional field to link to the messenger-userId collection using their ID.
   */
  messengerUserId?: string;

  /**
   * The status of the enrolled learner.
   */
  status: EnrolledEndUserStatus;
}

/**
 * Enum representing the status of an enrolled learner.
 */
export enum EnrolledEndUserStatus {
  active = 1,
  inactive = 2
}
