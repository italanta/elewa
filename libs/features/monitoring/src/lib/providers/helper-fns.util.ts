import { GroupProgressModel } from '@app/model/analytics/group-based/progress';

/** formart Date and then pass to chart */
export function formatDate(time: number): string {
  const date = new Date(time);
  return date.getDate() + '/' + (date.getMonth() + 1);
}

/** getRandomColor */
export function getColor(idx: number) {
  return [
    '#e3342f',
    '#f6993f',
    '#f66d9b',
    '#ffed4a',
    '#4dc0b5',
    '#3490dc',
    '#6574cd',
    '#9561e2',
    '#38c172',
  ][idx];
}

/** Retrieves daily milestones of all users */
export function getDailyProgress(allProgress: GroupProgressModel[]) {
  return allProgress;
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

/** Retrieves monthly milestones of all users */
export function getMonthlyProgress(allProgress: GroupProgressModel[]) {
  return allProgress.filter((model) => {
    const timeInDate = new Date(model.time); // 0 = Sunday, 1 = Monday, ...
    const isLastDayOfMonth = new Date(timeInDate.getFullYear(), timeInDate.getMonth() + 1, 0).getDate() === timeInDate.getDate();

    if (isLastDayOfMonth) return true;
    else return false;
  });
}
