import * as moment from 'moment';

import { __DateFromStorage } from '@iote/time';

import { GroupProgressModel, Periodicals, UserCount } from '@app/model/analytics/group-based/progress';

const chartColors = [
  "#008080", // Teal
  "#000080", // Navy
  "#800080", // Purple
  "#EC652A", // Orange
  "#800000", // Maroon
  "#008000", // Green
  "#0000FF", // Blue
  "#00FFFF", // Aqua
  "#FF00FF", // Fuchsia
  "#FFFF00", // Yellow
  "#C0C0C0", // Silver
  "#808080", // Gray
  "#99CCFF", // Sky Blue
  "#4E4187", //
  "#FF99CC", // Pink
  "#CC99FF", // Lavender
  "#FFCC99", // Peach
  "#99CCCC", // Pale Cyan
  "#CC9999", // Rose
  "#FFFF99"  // Light Yellow
];

/** formart Date and then pass to chart */
export function formatDate(time: number, period: Periodicals): string {
  const momentDate = moment.unix(time/1000);

  switch (period) {
    case "Daily":
      return momentDate.format('DD MMM')
    case "Weekly":
      return momentDate.startOf('week').format("ddd DD/MM/YY");
    case "Monthly":
      return momentDate.format("MMMM [']YY");
    default:
      return momentDate.format('DD/MM YY');
  }

  // const date = new Date(time);
  // return date.getDate() + '/' + (date.getMonth() + 1);
}

export function getLabels(models: GroupProgressModel[], period: Periodicals, isLast: boolean) {
  const currentDate = moment();

  const labels = models.map((day) => formatDate(day.time, period));

  if (period !== 'Daily' && isLast) {

    // Push only if not end of period
    if (!isEndOfWeek(currentDate) || !isEndOfMonth(currentDate)) {
      labels.push(formatDate(Date.now(), period));
    }
    
  }
  return labels;
}

function isEndOfWeek(date: moment.Moment) {
  const dayOfWeek = date.day();

  return dayOfWeek === 6;
}

function isEndOfMonth(date: moment.Moment) {
  // Check if date is the last day of the month
  return date.endOf('month').isSame(date, 'day');
}


/** getRandomColor */
export function getColor(idx: number) {
  return chartColors[idx];
}

/** Retrieves daily milestones of all users */
export function getDailyProgress(allProgress: GroupProgressModel[]) {
  const now = moment();

  // Show only data for the last 9 days
  return allProgress.filter((progress)=> {
    const date = __DateFromStorage(progress.createdOn as Date);

    return now.diff(date, 'days') < 10;
  })
}

/** Retrieves weekly milestones of all users */
export function getWeeklyProgress(allProgress: GroupProgressModel[]) {
  return allProgress.filter((model) => {
    const timeInDate = new Date(model.time);
    const dayOfWeek = timeInDate.getDay();

    if (dayOfWeek === 5) return true; // if friday
    else return false;
  });
}

export function getAllDaysCountCourse(dailyProgress: GroupProgressModel[], usersType: 'activeUsers' | 'inactiveUsers' | 'totalUsers', courseId: string) {
  return dailyProgress.map((mod) => 
  {
    const course =  mod.courseProgress[courseId];
    const usersInCourse = course[usersType] as UserCount;

    return {
      count: usersInCourse.dailyCount,
      date: __DateFromStorage(mod.createdOn as Date)
    }
  });
}

export function getEngagedUsersCurrentWeek(dailyProgress: GroupProgressModel[], usersType: 'activeUsers' | 'inactiveUsers' | 'totalUsers', courseId: string): number 
{
  const usersEnrolledInCurrentWeek = dailyProgress[dailyProgress.length-1];
  const userCount = usersEnrolledInCurrentWeek.courseProgress[courseId][usersType] as UserCount;

  return userCount.currentWeekCount || userCount.dailyCount;
}

export function getEngagedUsersCurrentMonth(dailyProgress: GroupProgressModel[], usersType: 'activeUsers' | 'inactiveUsers' | 'totalUsers', courseId: string): number {
  const usersEnrolledInCurrentMonth = dailyProgress[dailyProgress.length-1];
  const userCount = usersEnrolledInCurrentMonth.courseProgress[courseId][usersType]  as UserCount;

  return userCount.currentMonthCount || userCount.dailyCount;
}

export function getEnrolledUsersCurrentWeek(dailyProgress: GroupProgressModel[]): number {
  const currentDate = moment();
  const startOfWeek = currentDate.clone().startOf('isoWeek');

  const usersEnrolledInCurrentWeek = dailyProgress
    .filter(data => __DateFromStorage(data.createdOn as Date).isSameOrAfter(startOfWeek))
    .reduce((total, data) => total + data.todaysEnrolledUsersCount.dailyCount, 0);

  return usersEnrolledInCurrentWeek;
}

export function getEnrolledUsersCurrentMonth(dailyProgress: GroupProgressModel[]): number {
  const currentDate = moment();
  const startOfMonth = currentDate.clone().startOf('month');

  const usersEnrolledInCurrentMonth = dailyProgress
    .filter(data => __DateFromStorage(data.createdOn as Date).clone().isSameOrAfter(startOfMonth))
    .reduce((total, data) => total + data.todaysEnrolledUsersCount.dailyCount, 0);

  return usersEnrolledInCurrentMonth;
}

/** Retrieves monthly milestones of all users */
export function getMonthlyProgress(allProgress: GroupProgressModel[]) {
  return allProgress.filter((model) => {
    const timeInDate = new Date(model.time); // 0 = Sunday, 1 = Monday, ...
    const isLastDayOfMonth = new Date(timeInDate.getFullYear(), timeInDate.getMonth() + 1, 0).getDate() === timeInDate.getDate();

    if (isLastDayOfMonth) return true;
    else return false;
  });
}
