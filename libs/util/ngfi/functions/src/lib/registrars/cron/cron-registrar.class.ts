import * as functions from 'firebase-functions';

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
              private _region: FIREBASE_REGIONS = 'europe-west1')
  { super(); }

  register(func: (dataSnap: any, context: any) => Promise<void>): functions.CloudFunction<any>
  {
    return functions.region(this._region)
                    .pubsub.schedule(this._schedule)
                    .timeZone(this._timezone ? this._timezone : 'Europe/Brussels')
                    .onRun((ctx) => func({}, ctx));
  }

  before(dataSnap: any, context: any): { data: {}, context: FunctionContext; } {
    return { data: dataSnap, context };
  }

  after(result: void, _: any): any {
    return;
  }

  onError(e: Error) {
    return new Promise((_) => { console.error(e.message); console.error(e.stack); throw e; });
  }

}
