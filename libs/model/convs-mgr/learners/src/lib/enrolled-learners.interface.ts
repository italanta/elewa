import { IObject } from "@iote/bricks";

/**
 * instance of an enrolled learner
 */
export interface EnrolledEndUser extends IObject {
  name: string;
  phoneNumber: string;
  classId: string;
  endUserId?: string; // To link to the end-users collection
  status: EnrolledEndUserStatus;
}

enum EnrolledEndUserStatus {
  active = 1,
  inactive = 2
}
