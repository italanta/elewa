import { BaseUserMetrics } from "./base-user-metrics.class";

export class UserMetricsService extends BaseUserMetrics
{

  async getDayUserCount(orgId: string, timeInUnix: number)
  {
    return this.getUsersDailyRange(orgId, timeInUnix, 'createdOn');
  }

  async getDayUserEngagement(orgId: string, timeInUnix: number)
  {
    return this.getUsersDailyRange(orgId, timeInUnix, 'lastActiveTime');
  }

  async getPastWeekUserCount(orgId: string, timeInUnix: number)
  {
    return this.getUsersWeeklyRange(orgId, timeInUnix, 'createdOn');
  }

  async getPastWeekUserEngagement(orgId: string, timeInUnix: number)
  {
    return this.getUsersWeeklyRange(orgId, timeInUnix, 'lastActiveTime');
  }

  async getPastMonthUserCount(orgId: string, timeInUnix: number)
  {
    return this.getUsersMonthlyRange(orgId, timeInUnix, 'createdOn');
  }

  async getPastMonthUserEngagement(orgId: string, timeInUnix: number)
  {
    return this.getUsersMonthlyRange(orgId, timeInUnix, 'lastActiveTime');
  }
}
