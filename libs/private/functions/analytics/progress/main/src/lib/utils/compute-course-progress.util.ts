import * as _ from 'lodash';
import * as moment from 'moment';

import { __DateFromStorage } from "@iote/time";

import { EnrolledEndUser } from "@app/model/convs-mgr/learners";
import { CourseProgress } from '@app/model/analytics/group-based/progress';

export function computeCourseProgress(enrolledUsers: EnrolledEndUser[])
{
  let courseProgress: { [key: string]: CourseProgress; };

  const now = moment();

  for (const user of enrolledUsers) {

    if (user.courses) {
      for (const course of user.courses) {

        let dailyActiveCount = 0;
        let pastWeekActiveCount = 0;
        let pastMonthActiveCount = 0;

        let dailyInactiveActiveCount = 0;
        let pastWeekInactiveActiveCount = 0;
        let pastMonthInactiveActiveCount = 0;

        const lastEngagementTime = __DateFromStorage(course.lastEngagementTime);

        const activedInDays = now.diff(lastEngagementTime, 'hours');

        if (activedInDays <= 24) {
          dailyActiveCount++;
        } else {
          dailyInactiveActiveCount++;
        }

        if (activedInDays <= 168) {
          pastWeekActiveCount++;
        } else {
          pastWeekInactiveActiveCount++;
        }
        if (now.isSame(lastEngagementTime, 'month')) {
          pastMonthActiveCount++;
        } else {
          pastMonthInactiveActiveCount++;
        }

        courseProgress[course.courseId].activeUsers.dailyCount += dailyActiveCount;
        courseProgress[course.courseId].activeUsers.pastWeekCount += pastWeekActiveCount;
        courseProgress[course.courseId].activeUsers.pastMonthCount += pastMonthActiveCount;

        courseProgress[course.courseId].inactiveUsers.dailyCount += dailyInactiveActiveCount;
        courseProgress[course.courseId].inactiveUsers.pastWeekCount += pastWeekInactiveActiveCount;
        courseProgress[course.courseId].inactiveUsers.pastMonthCount += pastMonthInactiveActiveCount;

      }
    }
  }

  // Iterate through each course progress object and get the total users
  Object.keys(courseProgress).forEach((courseId) =>
  {
    const currentCourseProgress = courseProgress[courseId];

    // Calculate total users for each time period
    ['dailyCount', 'pastWeekCount', 'pastMonthCount'].forEach((period) =>
    {
      // Sum activeUsers and inactiveUsers
      const totalUsers =
        currentCourseProgress.activeUsers[period] +
        currentCourseProgress.inactiveUsers[period];

      // Update totalUsers in the 'total' property
      currentCourseProgress.totalUsers[period] = totalUsers;
    });
  });



  return courseProgress;
}


