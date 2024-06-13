import { ScheduleOptions, ScheduledEvent, onSchedule } from 'firebase-functions/v2/scheduler';

import { FunctionRegistrar } from "../function-registrar.interface";

import { FunctionContext } from "../../context/context.interface";
import { FIREBASE_REGIONS } from '../regions.type';

/**
 * CRON registrar.
 *
 * CRON JOB Registration
 */
export class CronRegistrar extends FunctionRegistrar<{}, void>
{
  /**
   *
   * @param _schedule When to run in UNIX job format. @see https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules?&_ga=2.120808456.-1063889319.1585573716#defining_the_job_schedule
   * @param _timezone? Timezone to run in. @see https://cloud.google.com/dataprep/docs/html/Supported-Time-Zone-Values_66194188
   */
  constructor(private _schedule: string,
              private _timezone?: string,
              private _config?: ScheduleOptions,
              private _region: FIREBASE_REGIONS = 'europe-west1')
  { super(); }

  register(func: (dataSnap: any, context: any) => Promise<void>): functions.CloudFunction<any>
  {
    const runConfig: ScheduleOptions = {
      schedule: this._schedule,
      region: this._region,

      ... (this._config ?? {})
    };
    if(this._timezone)
      runConfig.timeZone = this._timezone;
    
    return onSchedule(runConfig, (event: ScheduledEvent) => func({}, event))
  }

  before(dataSnap: any, context: any): Promise<{ data: {}, context: FunctionContext; }>
  {
    const event = context as ScheduledEvent;
    const ctx = {
      eventContext: event,
      isAuthenticated: true, userId: 'cron-job'
    } as FunctionContext;

    return new Promise(resolve => resolve({ data: {}, context: ctx }));
  }

  after(result: void, _: any): any {
    return;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(e.stack); throw e; });
  }

}
