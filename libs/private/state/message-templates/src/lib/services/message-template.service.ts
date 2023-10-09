import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { BehaviorSubject, Observable } from 'rxjs';
import { MessageTemplateStore } from '../store/message-template.store';

import { MessageTemplate, MessageTypes, SendMessageTemplate } from '@app/model/convs-mgr/functions'
import { ActiveMessageTemplateStore } from '../store/active-message-template.store';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';

@Injectable({
  providedIn: 'root',
})
export class MessageTemplatesService {

  // private channel = "103758545758463";
  private channel = "123034824233910";

  constructor(
    private _aff:  AngularFireFunctions, 
    private _messageTemplateStore$$: MessageTemplateStore,
    private _activeTemplate$$: ActiveMessageTemplateStore
  ) {}

  private templateCallFunction(action: string, data: MessageTemplate): Observable<any> {
    const templateRef = this._aff.httpsCallable('messageTemplateAPI');

    console.log(data);
    return templateRef({ 
      action: action,
      channelId: this.channel, 
      template: data
    });
  }
  private statusCallFunction(data: MessageStatusReq): Observable<any> {
    const templateRef = this._aff.httpsCallable('channelWhatsappGetTemplates');
    console.log("sending", templateRef);
    return templateRef(data);
  }

  // private sendCallFunction(data: MessageStatusReq): Observable<any> {
  //   const templateRef = this._aff.httpsCallable('channelWhatsappGetTemplates');
  //   console.log("sending", templateRef);
  //   return templateRef(data);
  // }


  private sendMessagesCallFunction(data: SendMessageTemplate): Observable<any> {
    const scheduleRef = this._aff.httpsCallable('sendMultipleMessages');
    console.log("sending", data);
    return scheduleRef(data);
  }

  // Adjust data types once I know what the functions return
  sendMessageTemplate(payload: any): Observable<any> {
    const sendMessageReq: SendMessageTemplate = {
      n:2,
      plaform: PlatformType.WhatsApp,
      message: {
        type:MessageTypes.TEXT,
        name: "hello_world",
        language: "en_US",
        templateType: TemplateMessageTypes.Text
      },
      endUsers: payload.endUsers,
    }
    return this.sendMessagesCallFunction( sendMessageReq );
  }

  addMessageTemplate(template: MessageTemplate){
    return this._messageTemplateStore$$.add(template);
  }

  removeTemplate(template: MessageTemplate){
    return this._messageTemplateStore$$.remove(template);
  }
  updateTemplate(template: MessageTemplate){
    return this._messageTemplateStore$$.update(template);
  }
  getTemplateById(templateId: string) {
    return this._messageTemplateStore$$.getOne(templateId);
  }
  
  getActiveTemplate$() {
    return this._activeTemplate$$.get();
  }

  getMessageTemplates$() {
    return this._messageTemplateStore$$.get();
  }
  // Adjust data types once I know what the functions return
  createTemplateMeta(payload: MessageTemplate): Observable<any> {
    return this.templateCallFunction('create', payload );
  }

  deleteTemplateMeta(payload: MessageTemplate): Observable<any> {
    return this.templateCallFunction('delete', payload);
  }

  updateTemplateMeta(payload: MessageTemplate): Observable<any> {
    return this.templateCallFunction('update', payload );
  }

  
  getTemplateStatus() :Observable<MessageStatusRes[]>{
    const messageStatusReq: MessageStatusReq = {
      fields: ["name", "status", "category"],
      limit: 20,
      channelId: "123034824233910"
    }
    return this.statusCallFunction(messageStatusReq);
  }
}

export interface MessageStatusRes {
  name: string;
  status: string;
}
export interface MessageStatusReq {
  fields: string[];
  limit: number;
  channelId: string;
}
