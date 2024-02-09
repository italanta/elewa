import * as _ from 'lodash';
import * as moment from 'moment';

import { __DateFromStorage } from "@iote/time";

import { EnrolledEndUser } from "@app/model/convs-mgr/learners";
import { CourseProgress } from '@app/model/analytics/group-based/progress';

export function computeCourseProgress(enrolledUsers: EnrolledEndUser[])
{
  let courseProgress: { [key: string]: CourseProgress; };

  const now = moment();

  // TODO: Avoid repetion of this loop
  for (const user of enrolledUsers) {

    if (user.courses) {
      for (const course of user.courses) {

        let dailyActiveCount = 0;
        let pastWeekActiveCount = 0;
        let pastMonthActiveCount = 0;

        let dailyInactiveActiveCount = 0;
        let pastWeekInactiveActiveCount = 0;
        let pastMonthInactiveActiveCount = 0;
        let completedLearnerCount = 0;
        let totalCompletionDuration = 0;

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

        completedLearnerCount = checkCourseCompleted(user, course.courseId);
        totalCompletionDuration = getCompletionDuration(user, course.courseId);

        courseProgress[course.courseId].activeUsers.dailyCount += dailyActiveCount;
        courseProgress[course.courseId].activeUsers.pastWeekCount += pastWeekActiveCount;
        courseProgress[course.courseId].activeUsers.pastMonthCount += pastMonthActiveCount;

        courseProgress[course.courseId].inactiveUsers.dailyCount += dailyInactiveActiveCount;
        courseProgress[course.courseId].inactiveUsers.pastWeekCount += pastWeekInactiveActiveCount;
        courseProgress[course.courseId].inactiveUsers.pastMonthCount += pastMonthInactiveActiveCount;
        courseProgress[course.courseId].completedLearnerCount += completedLearnerCount;
        courseProgress[course.courseId].totalCompletionDuration += totalCompletionDuration;
      }
    }
  }

  courseProgress = getAllCoursesTotals(courseProgress, enrolledUsers);
  
  return courseProgress;
}

export function checkCourseCompleted(enrolledUser: EnrolledEndUser, courseId: string): number 
{
  const value = _.find(enrolledUser.completedCourses, { id: courseId });

  if (value) return 1;
  return 0;
}

export function getCompletionDuration(enrolledUser: EnrolledEndUser, courseId: string) 
{
  const completedCourseInfo = _.find(enrolledUser.completedCourses, { id: courseId });
  if (!completedCourseInfo) return 0;

  const courseInfo = _.find(enrolledUser.courses, { courseId: completedCourseInfo.id });

  const startedOn = __DateFromStorage(courseInfo.enrollmentDate);
  const completedOn = __DateFromStorage(completedCourseInfo.completionDate);

  return startedOn.diff(completedOn, 'seconds');
}

export function enrolledUsersInCourse(enrolledEndUsers: EnrolledEndUser[], courseId: string)
{
  return enrolledEndUsers.filter((user) => user.courses.find((course) => course.courseId == courseId))
    .map((user) => user.id);
}

export function getAllCoursesTotals(courseProgress: { [key: string]: CourseProgress; }, enrolledUsers: EnrolledEndUser[])
{

  const totalActiveUsers = {
    dailyCount: 0,
    pastWeekCount: 0,
    pastMonthCount: 0
  };

  const totalInactiveUsers = {
    dailyCount: 0,
    pastWeekCount: 0,
    pastMonthCount: 0
  };

  
  // Iterate through each course progress object and get the total users
  Object.keys(courseProgress).forEach((courseId) =>
  {
    // Get all the users enrolled in course
    courseProgress[courseId].enrolledUsers = enrolledUsersInCourse(enrolledUsers, courseId);
    
    // Calculate total users for each period
    ['dailyCount', 'pastWeekCount', 'pastMonthCount'].forEach((period) =>
    {
          // Update total active users
    totalActiveUsers[period] += courseProgress[courseId].activeUsers[period];

    // Update total inactive users
    totalInactiveUsers[period] += courseProgress[courseId].inactiveUsers[period];

      // Sum activeUsers and inactiveUsers
      const totalUsers =
      courseProgress[courseId].activeUsers[period] +
      courseProgress[courseId].inactiveUsers[period];
      
      // Update totalUsers in the 'total' property
      courseProgress[courseId].totalUsers[period] = totalUsers;
    });
  });
  
  courseProgress['all'].activeUsers = totalActiveUsers;
  courseProgress['all'].inactiveUsers = totalInactiveUsers;

  return courseProgress;
}


