import cronstrue from 'cronstrue';

import { ScheduleOptions, ScheduleOptionType } from '@app/model/convs-mgr/functions';
import { __DateFromStorage } from '@iote/time';

export function getHumanReadableSchedule(schedule: ScheduleOptions): string {
  if (schedule.scheduleOption === ScheduleOptionType.Milestone) {
    return `Send message at milestone - ${schedule.milestone.selectedMilestone.eventName}`;
  } else if (schedule.scheduleOption === ScheduleOptionType.Inactivity) {
    const inactivityTime = schedule.inactivityTime ?? 0;
    return `Send message after ${inactivityTime} hours of inactivity`;
  } else if (schedule.scheduleOption === ScheduleOptionType.SpecificTime) {
    if (schedule.dispatchTime && !schedule.frequency) {
      return `Send message at ${__DateFromStorage(schedule.dispatchTime).format('HH:mm, DD/MM/YYYY')}`;
    } else if (schedule.frequency) {
      const cronReadable = getCronReadable(schedule.frequency);
      return `Send message ${cronReadable.toLocaleLowerCase()}`;
    }
  }

  return 'Invalid schedule type';
}

function getCronReadable(cronExpression: string): string {
  try {
    const cronReadable = cronstrue.toString(cronExpression);
    return cronReadable;
  } catch (error) {
    console.error('Error parsing cron expression:', error);
    return 'Unable to parse cron expression';
  }
}
