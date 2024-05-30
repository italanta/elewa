import * as _ from 'lodash';
import * as moment from 'moment';

import { __DateFromStorage } from "@iote/time";

import { EnrolledEndUser } from "@app/model/convs-mgr/learners";
import { CourseProgress } from '@app/model/analytics/group-based/progress';

export function computeCourseProgress(enrolledUsers: EnrolledEndUser[], timeInUnix: number) {
  const now = moment.unix(timeInUnix / 1000);

  const courseProgress: { [key: string]: CourseProgress } = {};

  enrolledUsers.forEach((user) => {
    if (user.courses) {
      user.courses.forEach((course) => {
        const lastEngagementTime = __DateFromStorage(course.lastEngagementTime || user.updatedOn);
        const activeDurationHours = now.diff(lastEngagementTime, 'hours');
        const startOfCurrentWeek = now.startOf('isoWeek');
        const courseId = course.courseId;

        if (!courseProgress[courseId]) {
          courseProgress[courseId] = {
            activeUsers: { dailyCount: 0, pastWeekCount: 0, pastMonthCount: 0, currentMonthCount: 0, currentWeekCount: 0 },
            inactiveUsers: { dailyCount: 0, pastWeekCount: 0, pastMonthCount: 0, currentMonthCount: 0, currentWeekCount: 0 },
            completedLearnerCount: 0,
            totalCompletionDuration: 0,
            totalUsers: { dailyCount: 0, pastWeekCount: 0, pastMonthCount: 0, currentMonthCount: 0, currentWeekCount: 0 },
            enrolledUsers: []
          };
        }

        const progress = courseProgress[courseId];

        if (activeDurationHours <= 24) {
          progress.activeUsers.dailyCount++;
        } else {
          progress.inactiveUsers.dailyCount++;
        }

        if (activeDurationHours <= 168) {
          progress.activeUsers.pastWeekCount++;
        } else {
          progress.inactiveUsers.pastWeekCount++;
        }

        if (activeDurationHours <= 730) {
          progress.activeUsers.pastMonthCount++;
        } else {
          progress.inactiveUsers.pastMonthCount++;
        }

        if (now.isSame(lastEngagementTime, 'month')) {
          progress.activeUsers.currentMonthCount++;
        } else {
          progress.inactiveUsers.currentMonthCount++;
        }

        if (lastEngagementTime.isSameOrAfter(startOfCurrentWeek, 'day')) {
          progress.activeUsers.currentWeekCount++;
        } else {
          progress.inactiveUsers.currentWeekCount++;
        }

        const completedCount = checkCourseCompleted(user, courseId);
        const completionDuration = getCompletionDuration(user, courseId);

        progress.completedLearnerCount += completedCount;
        progress.totalCompletionDuration += completionDuration;
      });
    }
  });

  return getAllCoursesTotals(courseProgress, enrolledUsers);
}

export function checkCourseCompleted(enrolledUser: EnrolledEndUser, courseId: string): number 
{
  const value = _.find(enrolledUser.completedCourses, { id: courseId });

  if (value) return 1;
  return 0;
}

export function getCompletionDuration(enrolledUser: EnrolledEndUser, courseId: string) 
{
  if (!enrolledUser.completedCourses) return 0;
  const completedCourseInfo = _.find(enrolledUser.completedCourses, { id: courseId });
  if (!completedCourseInfo) return 0;

  const courseInfo = _.find(enrolledUser.courses, { courseId: completedCourseInfo.id });

  const startedOn = __DateFromStorage(courseInfo.enrollmentDate || enrolledUser.createdOn);
  const completedOn = __DateFromStorage(completedCourseInfo.completionDate);

  return startedOn.diff(completedOn, 'seconds');
}

export function enrolledUsersInCourse(enrolledEndUsers: EnrolledEndUser[], courseId: string)
{
  return enrolledEndUsers.filter((user) => {
    if(!user.courses) return undefined;
    return user.courses.find((course) => course.courseId == courseId)
  }).map((user) => user.id);
}

export function getAllCoursesTotals(courseProgress: { [key: string]: CourseProgress }, enrolledUsers: EnrolledEndUser[]) {
  const totalActiveUsers =  { dailyCount: 0, pastWeekCount: 0, pastMonthCount: 0, currentMonthCount: 0, currentWeekCount: 0 };
  const totalInactiveUsers =  { dailyCount: 0, pastWeekCount: 0, pastMonthCount: 0, currentMonthCount: 0, currentWeekCount: 0 };

  Object.keys(courseProgress).forEach((courseId) => {
    const enrolledUsersInThisCourse = enrolledUsersInCourse(enrolledUsers, courseId);

    ['dailyCount', 'pastWeekCount', 'pastMonthCount', 'currentMonthCount', 'currentWeekCount'].forEach((period) => {
      totalActiveUsers[period] += courseProgress[courseId].activeUsers[period];
      totalInactiveUsers[period] += courseProgress[courseId].inactiveUsers[period];

      const totalUsers =
        courseProgress[courseId].activeUsers[period] +
        courseProgress[courseId].inactiveUsers[period];

      courseProgress[courseId].totalUsers[period] = totalUsers;
    });

    courseProgress[courseId].enrolledUsers = enrolledUsersInThisCourse;
  });

  courseProgress['all'] = {
    activeUsers: totalActiveUsers,
    inactiveUsers: totalInactiveUsers,
  };

  return courseProgress;
}


