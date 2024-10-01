import * as moment from 'moment';
import { Timestamp } from '@firebase/firestore-types';

export type AppDate = moment.Moment;
export type AppDateInput = moment.MomentInput;

/**
 * Utility that turns an object into a Date.
 */
export const __NewDate = (input?: AppDateInput) => <AppDate> (input ? moment(input) : moment());

/**
 * Utility that turns an object into a Date and immediately prepares it for storage.
 */
export const __NewDateForStorage = (input: AppDateInput) => __DateToStorage(__NewDate(input));

/**
 * Utility that transforms firestore date into a date object.
 *
 * @param unixDate - Date as stored in firestore. IMPORTANT: Do not pass actual date objects!!!
 *                   20/07 - Since store changes a date is now either of Date type (local updates) or of Timestamp (DB updates)
 *                           @see https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
 */
export function __DateFromStorage(unixDate: Timestamp | Date, offsetCorrection = false) : AppDate
{   
  const dateTime = unixDate as any;

  const seconds = (dateTime.seconds || dateTime._seconds)
                      ? dateTime.seconds ?? dateTime._seconds
                      : null;
  const appDate :  moment.Moment
          = seconds
              ? moment(seconds * 1000)
              : moment(unixDate);

  if (offsetCorrection)
  {
    const offset = __GetTimezoneOffset();
    return correctDst(appDate.utc().utcOffset(offset));
  }

  return appDate;
}
/** Turns a date into a Firebase Timestamp.
 *    Important! For use in httpsCallable, pass the serialize parameter.
 *    Warning: Serialize will use fake ducktyping so do not expect the file to still be a Timestamp. */
export function __DateToStorage(date: AppDate, serialize?: boolean) : Timestamp
{
  /** Mock as though the date is a timestamp,
   *    but actually work with regular dates.
   *  Firestore API will change the dates into timestamps automagically if we use client library.
   *
   *  For HTTP and/or Cloud Fn serialization, use number values.
   *  @see https://stackoverflow.com/questions/30363973/serializing-dates-in-moment-js*/

  return <Timestamp> <any> (serialize ? date.valueOf()
                                      : date.toDate());
}

export function __FormatDateFromStorage(date: Timestamp | Date, format?: string)
{
  if(!date){
    return '';
  }
  return __DateFromStorage(date).format(format ? format :'DD/MM/YYYY');
}

export function __FormatDate(date: AppDate, format?: string)
{
  return date.format(format ? format : 'DD/MM/YYYY');
}

/**Function used to set time being used on app to 10 am so that to correct issues with time zone
 * for **border dates** e.g last/first day of a financial year
*/

export function __CorrectDateTimeZoneOffset(date: AppDate){
  return date.hour(10).utc();

}


/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
 *
 * @returns Timezone offset from utc (eg in Kenya returns +3)
 */
export function __GetTimezoneOffset()
{
  return -(new Date().getTimezoneOffset()/60);
}

function correctDst(appDate: AppDate)
{
  return moment().isDST()
          ? appDate.add(1, 'hours')
          : appDate;
}
