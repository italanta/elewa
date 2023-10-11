import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';

import { MessageTypes, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';

import { ScheduledMessageStore } from '../store/scheduled-message.store';


@Injectable({
  providedIn: 'root',
})
export class ScheduleMessageService {
  private channel = "123034824233910";
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
    const scheduledMessageReq = {
      channelId: this.channel,
      message: {
        type:MessageTypes.TEXT,
        name: payload.name,
        language: "en_US",
        templateType: TemplateMessageTypes.Text
      },
      usersFilters: {
        endUsersId: payload.endUsers
      },
      dispatchTime: payload.dispatchTime
    }
    return this.scheduleCallFunction( scheduledMessageReq );
  }

  private scheduleCallFunction(data: any){
    const scheduleRef = this._aff.httpsCallable('scheduleMessageTemplates');
    return scheduleRef(data);
  }
  
}