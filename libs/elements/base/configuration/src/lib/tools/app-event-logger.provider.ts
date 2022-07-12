import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

import { EventLogger, Logger } from '@iote/bricks-angular';

/**
 * Wrapper around event logging middleware such as Google Analytics, ...
 */
@Injectable({ providedIn: 'root' })
export class AppEventLogger extends EventLogger
{
  constructor(private _frbAnalytics: AngularFireAnalytics, _logger: Logger)
  {
    super(_logger);
  }

  // Log events both to firebase and intercom
  logEvent(name: string, data: any, options: any)
  {
    this._frbAnalytics.logEvent(name, data, options);
  }
}
