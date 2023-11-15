import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { ScheduledMessage } from '@app/model/convs-mgr/functions';

import { ScheduledMessageStore } from '../store/scheduled-message.store';
import { TemplateMessage } from '@app/model/convs-mgr/conversations/messages';


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

  getScheduledMessageById$(id: string) {
    return this._scheduledMessageStore$$.getOne(id);
  }

  getScheduledMessages$() {
    return this._scheduledMessageStore$$.get();
  }

  scheduleMessage(payload: any){
    const scheduledMessageReq: any = {
      id: payload.id,
      channelId: payload.channelId,
      message: payload.message,
      enrolledEndUsers: payload.enrolledEndUsers,
      dispatchTime: payload.dispatchTime
    }
    return this.scheduleCallFunction( scheduledMessageReq );
  }

  private scheduleCallFunction(data: any){
    const scheduleRef = this._aff.httpsCallable('scheduleMessageTemplates');
    return scheduleRef(data);
  }

  scheduleInactivity(inactivityPayload: any) {
    return this.callInactivityFunction(inactivityPayload);
  }

  private callInactivityFunction(data: {  message: TemplateMessage, inactivityTime: number; channelId: string;}) {
    const inactivityRef = this._aff.httpsCallable('setInactivity');
    return inactivityRef(data);
  }
  
}