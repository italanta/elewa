import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { ScheduledMessage } from '@app/model/convs-mgr/functions';

import { ScheduledMessageStore } from '../store/scheduled-message.store';
import { ScheduleMessagesReq } from 'libs/private/functions/convs-mgr/conversations/message-templates/scheduler/src/lib/model/schedule-message-req';


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
  getScheduledMessages$() {
    return this._scheduledMessageStore$$.get();
  }

  scheduleMessage(payload: any){
    const scheduledMessageReq: ScheduleMessagesReq = {
      channelId: payload.channelId,
      message: payload.message,
      usersFilters: {
        endUsersId: payload.endUsers
      },
      dispatchTime: payload.dispatchTime
    }
    return this.scheduleCallFunction( scheduledMessageReq );
  }

  private scheduleCallFunction(data: ScheduleMessagesReq){
    const scheduleRef = this._aff.httpsCallable('scheduleMessageTemplates');
    return scheduleRef(data);
  }
  
}