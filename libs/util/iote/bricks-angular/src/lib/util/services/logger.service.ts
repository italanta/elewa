import { Injectable } from '@angular/core';
/**
 * Simple wrapper around console.log.
 * Class used for production logging. Hide debug info, errors and warnings from hackers
 *
 * @author JRosseel, 19/08/'16
 */
@Injectable({ providedIn: 'root' })
export class Logger 
{
  // We pass functions, to avoid evaluation of arguments on pass to the logger service.
  //  In production, logger.debug will not execute the method and thus not evaluate the argments.
  log(msg: () => any) { console.log(msg()); }

  debug(msg: () => any) { /** Do nothing */ }
  warn (msg: () => any) { console.warn(msg());  }
  error(msg: () => any) { console.error(msg()); }
}
