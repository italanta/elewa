import { IObject } from "@iote/bricks";

import { AUStatus } from "./assignable-unit.interface";

export interface CourseParticipation extends IObject {
    startedOn: Date;
    completedOn?: Date;
    status: CourseStatus;

    auStatus?: AUStatus[];
}

export enum CourseStatus 
{
  InProgress = "in-progress",
  Completed = "completed",
  Unsatisfactory = "unsatisfactory"
}