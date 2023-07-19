import { IObject } from "@iote/bricks";

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
