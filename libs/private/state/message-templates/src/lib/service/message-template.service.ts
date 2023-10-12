import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, first, switchMap, throwError } from 'rxjs';

import { MessageTemplate, MessageTypes, SendMessageTemplate } from '@app/model/convs-mgr/functions'
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { ChannelService } from '@app/private/state/organisation/channels';

import { MessageTemplateStore } from '../store/message-template.store';

@Injectable({
  providedIn: 'root',
})
export class MessageTemplatesService {
  channel: CommunicationChannel;

  constructor(
    private _aff:  AngularFireFunctions, 
    private _messageTemplateStore$$: MessageTemplateStore,
    private _channels$$: ChannelService
  ) {}

  private templateCallFunction(action: string, data: MessageTemplate) {
    const templateRef = this._aff.httpsCallable('messageTemplateAPI');
    return templateRef({
      action: action,
      channelId: this.channel.id,
      template: data,
    });
  }

  private statusCallFunction(data: MessageStatusReq) {
    const templateRef = this._aff.httpsCallable('channelWhatsappGetTemplates');
    return templateRef(data);
  }

  private sendMessagesCallFunction(data: SendMessageTemplate) {
    const scheduleRef = this._aff.httpsCallable('sendMultipleMessages');
    return scheduleRef(data);
  }

  private constructSendMessageReq(payload: any, channel: CommunicationChannel): SendMessageTemplate {
    return {
      n: channel.n || 0,
      plaform: channel.type as PlatformType,
      message: {
        type: payload.type,
        name: payload.template.name,
        language: payload.template.language,
        templateType: payload.templateType,
      },
      endUsers: payload.endUsers,
    };
  }

  private handleInvalidChannelError(): Observable<never> {
    return throwError('Invalid channel or channel type.');
  }

  sendMessageTemplate(payload: any, channelId: string): Observable<any> {
    return this._channels$$.getChannelById(channelId).pipe(
      first(),
      switchMap((channel) => {
        if (channel && channel.type) {
          this.channel = channel;
          const sendMessageReq = this.constructSendMessageReq(payload, channel);
          return this.sendMessagesCallFunction(sendMessageReq);
        } else {
          return this.handleInvalidChannelError();
        }
      })
    );
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
      channelId: this.channel.id || ''
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
