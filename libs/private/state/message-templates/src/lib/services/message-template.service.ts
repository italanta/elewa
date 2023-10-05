import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';
import { MessageTemplateStore } from '../store/message-template.store';

import { MessageTemplate } from '@app/model/convs-mgr/functions'
import { ActiveMessageTemplateStore } from '../store/active-message-template.store';

@Injectable({
  providedIn: 'root',
})
export class MessageTemplatesService {
  constructor(
    private _aff:  AngularFireFunctions, 
    private _messageTemplateStore$$: MessageTemplateStore,
    private _activeTemplate$$: ActiveMessageTemplateStore
  ) {}

  private templateCallFunction(action: string, data: any): Observable<any> {
    const templateRef = this._aff.httpsCallable('messageTemplateAPI');
    console.log("sending", templateRef);
    return templateRef({ action, ...data });
  }
  private statusCallFunction(data: MessageStatusReq): Observable<any> {
    const templateRef = this._aff.httpsCallable('channelWhatsappGetTemplates');
    console.log("sending", templateRef);
    return templateRef(data);
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
  

  getActiveTemplate$() {
    return this._activeTemplate$$.get();
  }

  getMessageTemplates$() {
    return this._messageTemplateStore$$.get();
  }
  // Adjust data types once I know what the functions return
  createTemplateMeta(payload: MessageTemplate): Observable<any> {
    return this.templateCallFunction('create', { payload });
  }

  deleteTemplateMeta(payload: MessageTemplate): Observable<any> {
    return this.templateCallFunction('delete', { payload });
  }

  updateTemplateMeta(payload: MessageTemplate): Observable<any> {
    return this.templateCallFunction('update', { payload });
  }

  
  getTemplateStatus() :Observable<MessageStatusRes[]>{
    const messageStatusReq: MessageStatusReq = {
      fields: ["name", "status", "category"],
      limit: 20,
      channelId: "100465209511767"
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
