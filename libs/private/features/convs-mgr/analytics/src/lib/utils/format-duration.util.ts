import * as moment from 'moment';

export function formatDuration(seconds: number): string {
  const duration = moment.duration(seconds, 'seconds');

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const remainingSeconds = duration.seconds();

  const parts = [];

  if (days > 0) {
    parts.push(`${days} day${days === 1 ? '' : 's'}`);
  }

  if (hours > 0 || (days === 0 && hours === 0)) {
    parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  }

  if (minutes > 0 || (days === 0 && hours === 0 && minutes === 0)) {
    parts.push(`${minutes} min${minutes === 1 ? '' : 's'}`);
  }

  if (remainingSeconds > 0 || (days === 0 && hours === 0 && minutes === 0)) {
    parts.push(`${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'}`);
  }

  const formattedDuration = parts.join(' ');

  return formattedDuration;
}