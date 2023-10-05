import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';

import { ScheduledMessageStore } from '../store/scheduled-messages.store';
import { ScheduledMessage } from '@app/model/convs-mgr/functions';

@Injectable({
  providedIn: 'root',
})
export class ScheduleMessageService {
  constructor(
    private _aff:  AngularFireFunctions, 
    private _scheduledMessageStore$$: ScheduledMessageStore
  ) {}

  addScheduledMesssage(message: ScheduledMessage) {
    return this._scheduledMessageStore$$.add(message);
  }
  updateScheduledMesssage(message: ScheduledMessage) {
    return this._scheduledMessageStore$$.update(message);
  }
  removeScheduledMesssage(message: ScheduledMessage) {
    return this._scheduledMessageStore$$.remove(message);
  }

  // Adjust data types once I know what the functions return
  scheduleMessage(payload: any): Observable<any> {
    return this.scheduleCallFunction( payload );
  }

  private scheduleCallFunction(data: any): Observable<any> {
    const scheduleRef = this._aff.httpsCallable('scheduleMessageTemplates');
    console.log("sending", scheduleRef);
    return scheduleRef(data);
  }
}
