import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';
import { MessageTemplateStore } from '../store/message-template.store';

import { MessageTemplate } from '@app/model/convs-mgr/functions'
import { ActiveMessageTemplateStore } from '../store/active-message-template.store';

@Injectable({
  providedIn: 'root',
})
export class ScheduleMessageService {
  constructor(
    private _aff:  AngularFireFunctions, 
    private _messageTemplateStore: MessageTemplateStore,
    private _activeTemplate: ActiveMessageTemplateStore
  ) {}

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
