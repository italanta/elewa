import * as moment from "moment";

import { Query } from "@ngfi/firestore-qbuilder";
import { HandlerTools, Repository } from "@iote/cqrs";

import { EnrolledEndUser } from "@app/model/convs-mgr/learners";

export class BaseUserMetrics
{
  protected totalEnrolledUsers: EnrolledEndUser[];

  constructor(private tools: HandlerTools) { }

  private getEnrolledUserRepo(orgId: string): Repository<EnrolledEndUser>
  {
    return this.tools.getRepository<EnrolledEndUser>(`orgs/${orgId}/enrolled-end-users`);
  }

  protected async getUsersDailyRange(orgId: string, timeInUnix: number, field: string)
  {
    const startAt = new Date(timeInUnix);
    startAt.setHours(0, 0, 0, 0);

    const endAt = new Date(timeInUnix);
    endAt.setHours(23, 59, 59, 999);

    const enrolledUsers = this.getEnrolledUserRepo(orgId).getDocuments(
      new Query().where(field, '>=', startAt).where(field, '<=', endAt)
    );

    return enrolledUsers;
  }

    /** get the past week created user count */
    async getUsersWeeklyRange(orgId: string, timeInUnix:number, field: string) {
      const momentTime = moment(timeInUnix);
      
      // Use isoWeek for consistency
      const startAt = new Date(momentTime.clone().startOf('isoWeek').toDate());
      const endAt = new Date(momentTime.clone().endOf('isoWeek').toDate());
  
      const enrolledUsers = this.getEnrolledUserRepo(orgId).getDocuments(
        new Query().where(field, '>=', startAt).where(field, '<=', endAt)
      );
  
      return enrolledUsers;
    };

  protected async getUsersMonthlyRange(orgId: string, timeInUnix: number, field: string)
  {
    const timeInDate = new Date(timeInUnix);
    const startAt = new Date(timeInDate.getFullYear(), timeInDate.getMonth(), 0);
    const endAt = new Date();

    const enrolledUsers = this.getEnrolledUserRepo(orgId).getDocuments(
      new Query().where(field, '>=', startAt).where(field, '<=', endAt)
    );

    return enrolledUsers;
  }

  getAllEnrolledUsers() {
    return this.totalEnrolledUsers;
  }

  setEnrolledUsers(enrolledUsers: EnrolledEndUser[]) {
    this.totalEnrolledUsers = enrolledUsers;
  }
}