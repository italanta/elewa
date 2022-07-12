import { Injectable } from '@angular/core';
import { Logger } from '@iote/bricks-angular';
/**
 * Simple wrapper around console.log.
 * Class used for production logging. Hide debug info, errors and warnings from hackers
 *
 * @author JRosseel, 19/08/'16
 */
@Injectable({ providedIn: 'root' })
export class DebugLogger extends Logger
{
  constructor() { super(); }

  override debug(msg: () => any) { console.debug(msg()); }
}
