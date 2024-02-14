import { HandlerTools } from "@iote/cqrs";

import { UserMetricsService } from "../data-services/user-metrics.service";

/**
 * Gets the number of enrolled users created today, in the past week (if it's friday), and in the past month (if end of month).
 * @param {UserMetricsService} userMetricsService - The user metrics service.
 * @param {string} orgId - The organization ID.
 */

export async function getEnrolledUserCreationCount(userMetricsService: UserMetricsService, orgId: string, tools: HandlerTools, timeInUnix: number)
{
  const timeToCollect = new Date(timeInUnix);
  const dayOfWeek = timeToCollect.getDay(); // 0 = Sunday, 1 = Monday, ...
  const isLastDayOfMonth = new Date(timeToCollect.getFullYear(), timeToCollect.getMonth() + 1, 0).getDate() === timeToCollect.getDate();

  const dailyCount = (await userMetricsService.getDayUserCount(orgId, timeInUnix)).length;

  let pastWeekCount = 0;
  let pastMonthCount = 0;

  pastWeekCount = (await userMetricsService.getPastWeekUserCount(orgId, timeInUnix)).length;

  pastMonthCount = (await userMetricsService.getPastMonthUserCount(orgId, timeInUnix)).length;

  tools.Logger.log(() => `[measureGroupProgressHandler].execute - Enrolled user creation count completed`);

  return {
    dailyCount,
    pastWeekCount,
    pastMonthCount
  };
}

/**
 * Gets the number of users who engaged with the bot today, in the past week (if it's friday), and in the past month (if end of month).
 * @param {UserMetricsService} userMetricsService - The user metrics service.
 * @param {string} orgId - The organization ID.
 */
export async function getEngagedUserCount(userMetricsService: UserMetricsService, orgId: string, tools: HandlerTools, timeInUnix: number)
{
  const timeToCollect = new Date(timeInUnix);
  const dayOfWeek = timeToCollect.getDay(); // 0 = Sunday, 1 = Monday, ...
  const isLastDayOfMonth = new Date(timeToCollect.getFullYear(), timeToCollect.getMonth() + 1, 0).getDate() === timeToCollect.getDate();

  // Get all the users in that organisation
  const totalUserCount = userMetricsService.getAllEnrolledUsers().length;

  // Daily active users
  const dailyCount = (await userMetricsService.getDayUserEngagement(orgId, timeInUnix)).length;

  let pastWeekCount = 0;
  let pastMonthCount = 0;

  if (dayOfWeek === 5) { // Friday (0-based index, where 5 represents Friday)
    pastWeekCount = (await userMetricsService.getPastWeekUserEngagement(orgId, timeInUnix)).length;
  }

  if (isLastDayOfMonth) {
    pastMonthCount = (await userMetricsService.getPastMonthUserEngagement(orgId, timeInUnix)).length;
  }

  tools.Logger.log(() => `[measureGroupProgressHandler].execute - Engaged user creation count completed`);

  return {
    active: {
      dailyCount,
      pastWeekCount,
      pastMonthCount
    },
    inactive: {
      dailyCount: totalUserCount - dailyCount,
      pastWeekCount: totalUserCount - pastWeekCount,
      pastMonthCount: totalUserCount - pastMonthCount
    }
  };
}