export interface ScheduleFormData {
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  time: string; // Format: 'HH:mm'
  daysOfWeek: number[]; // Array of numbers for weekly
  daysOfMonth: number[]; // Day of the month for monthly
  interval: number; // Interval for repeating tasks
}

export function ConvertToCron(data: ScheduleFormData): string {
  let cronExpression = '';
  let daysOfWeekCron: string;
  let daysOfMonthCron: string;
  const interval = data.interval;

  // Extract hours and minutes from time
  const [hours, minutes] = data.time.split(':').map(Number);

  switch (data.frequency) {
    case 'Daily':
      // For daily, the interval is every 'x' days
      cronExpression = `${minutes} ${hours} * * *`;

      if(interval) {
        cronExpression = `${minutes} ${hours} */${data.interval} * *`;
      }
      break;
    case 'Weekly':
      // For weekly, the interval is every 'x' weeks
      // 'daysOfWeek' will be used to specify which days of the week within those weeks
      daysOfWeekCron = data.daysOfWeek.join(',');
      cronExpression = `${minutes} ${hours} * * ${daysOfWeekCron}/${data.interval}`;
      break;
    case 'Monthly':
      // For monthly, the interval is every 'x' months
      daysOfMonthCron = data.daysOfMonth.join(',');

      cronExpression = `${minutes} ${hours} ${daysOfMonthCron} * *`;

      if(interval) {
        cronExpression = `${minutes} ${hours} ${daysOfMonthCron} */${data.interval} *`;
      }
      break;
  }

  return cronExpression;
}
