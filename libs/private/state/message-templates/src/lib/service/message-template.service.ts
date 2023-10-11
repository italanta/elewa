import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable } from 'rxjs';

import { MessageTemplate, MessageTypes, SendMessageTemplate } from '@app/model/convs-mgr/functions'
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';

import { MessageTemplateStore } from '../store/message-template.store';

@Injectable({
  providedIn: 'root',
})
export class MessageTemplatesService {

  private channel = "103758545758463";
  // private channel = "123034824233910";

  constructor(
    private _aff:  AngularFireFunctions, 
    private _messageTemplateStore$$: MessageTemplateStore
  ) {}

  private templateCallFunction(action: string, data: MessageTemplate){
    const templateRef = this._aff.httpsCallable('messageTemplateAPI');

    return templateRef({ 
      action: action,
      channelId: this.channel, 
      template: data
    });
  }
  private statusCallFunction(data: MessageStatusReq){
    const templateRef = this._aff.httpsCallable('channelWhatsappGetTemplates');
    return templateRef(data);
  }

  private sendMessagesCallFunction(data: SendMessageTemplate){
    const scheduleRef = this._aff.httpsCallable('sendMultipleMessages');
    return scheduleRef(data);
  }

  sendMessageTemplate(payload: any){
    const sendMessageReq: SendMessageTemplate = {
      n:2,
      plaform: PlatformType.WhatsApp,
      message: {
        type:MessageTypes.TEXT,
        name: payload.name,
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

  getMessageTemplates$() {
    return this._messageTemplateStore$$.get();
  }
  createTemplateMeta(payload: MessageTemplate){
    return this.templateCallFunction('create', payload );
  }

  deleteTemplateMeta(payload: MessageTemplate){
    return this.templateCallFunction('delete', payload);
  }

  updateTemplateMeta(payload: MessageTemplate){
    return this.templateCallFunction('update', payload );
  }

  
  getTemplateStatus() :Observable<MessageStatusRes[]>{
    const messageStatusReq: MessageStatusReq = {
      fields: ["name", "status", "category"],
      limit: 20,
      channelId: this.channel
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
