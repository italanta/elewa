import { IObject } from "@iote/bricks";

import { AssessmentResult } from "@app/model/convs-mgr/conversations/admin/system";

import { SurveyResults } from "./survey-results.interface";

import { EnrolledUserCourse } from "./enrolled-user-courses.interface";

/**
 * Represents an enrolled learner.
 */
export interface EnrolledEndUser extends IObject {
  /**
   * The name of the enrolled learner.
   */
  name ?: string;

  /**
   * The phone number of the enrolled learner.
   */
  phoneNumber?: string;

  /**
   * Receipient ID for sending messages on messenger
   */
  receipientId?: string;

  /**
   * The ID of the class to which the learner is enrolled.
   */
  classId: string;

  /**
   * The current course that a learner is in.
   * 
   * TODO: Change to array of modules.
   *       If they start a module, we add it to the array
   */
  currentCourse?: string;

  /** The courses done by the end-user including the current one 
   * TODO: Limit the stack to 20, and add the logic to the bot engine
   */
  courses?: EnrolledUserCourse[];

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

  // ToDO: Backend Implementation
  /**
     * The results of the assessments that the end user has taken.
     */
  assessmentResults?: AssessmentResult[];

  surveyResults?: SurveyResults[];

  /** 
   * Will represent the platform specific details of the end user e.g.
   * 
   * Their user ID changes according to the platform
   * 
   * TODO: @Reagan Deprecate whatsappUserId, phoneNumber,receipientId 
   *          and messengerUserId properties
  */
  platformDetails?: {[key:string]:{ endUserId: string, contactID: string}};
}

/**
 * Enum representing the status of an enrolled learner.
 */
export enum EnrolledEndUserStatus {
  Active = 1,
  Inactive = 2
}
