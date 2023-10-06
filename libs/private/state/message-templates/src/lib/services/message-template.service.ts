import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { BehaviorSubject, Observable } from 'rxjs';
import { MessageTemplateStore } from '../store/message-template.store';

import { MessageTemplate } from '@app/model/convs-mgr/functions'
import { ActiveMessageTemplateStore } from '../store/active-message-template.store';

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

  sendMessageTemplate(data: any){
    console.log(data)
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
