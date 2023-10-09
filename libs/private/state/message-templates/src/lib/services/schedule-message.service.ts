import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';

import { ScheduledMessageStore } from '../store/scheduled-messages.store';
import { MessageTypes, ScheduledMessage } from '@app/model/convs-mgr/functions';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';

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
    const scheduledMessageReq = {
      channelId: "123034824233910",
      message: {
        type:MessageTypes.TEXT,
        name: "hello_world",
        language: "en_US",
        templateType: TemplateMessageTypes.Text
      },
      usersFilters: {
        endUsersId: ["dd698779-ecd0-4f90-957"]
      },
      dispatchTime: payload.dispatchTime
    }
    console.log(scheduledMessageReq);
    return this.scheduleCallFunction( scheduledMessageReq );
  }

  private scheduleCallFunction(data: any): Observable<any> {
    const scheduleRef = this._aff.httpsCallable('scheduleMessageTemplates');
    console.log("sending", data);
    return scheduleRef(data);
  }
  
}
