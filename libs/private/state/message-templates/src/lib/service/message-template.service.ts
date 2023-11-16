import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, first, switchMap, throwError } from 'rxjs';

import { MessageTemplate } from '@app/model/convs-mgr/functions'
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

import { MessageTemplateStore } from '../store/message-template.store';
import { MessageStatusReq, MessageStatusRes } from '../models/message-status.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageTemplatesService {
  channel: CommunicationChannel;

  constructor(
    private _aff:  AngularFireFunctions, 
    private _messageTemplateStore$$: MessageTemplateStore,
    private _channelsServ$: CommunicationChannelService
  ) {}

  private templateCallFunction(action: string, data: MessageTemplate) {
    const templateRef = this._aff.httpsCallable('messageTemplateAPI');
    return templateRef({
      action: action,
      channelId: data.channelId,
      template: data,
    });
  }

  private statusCallFunction(data: MessageStatusReq) {
    const templateRef = this._aff.httpsCallable('channelWhatsappGetTemplates');
    return templateRef(data);
  }

  private sendMessagesCallFunction(data: any) {
    const scheduleRef = this._aff.httpsCallable('sendMultipleMessages');
    return scheduleRef(data);
  }

  private constructSendMessageReq(payload: any, channel: CommunicationChannel, selectedUsers: EnrolledEndUser[]): any {
    const endUserIds =  selectedUsers.map((user)=> {
      if(user.platformDetails){
        return user.platformDetails[channel.type].endUserId
      } else {
        return null;
      }
    });

    return {
      n: channel.n || 0,
      plaform: channel.type as PlatformType,
      message: {
        type: payload.type,
        name: payload.template.name,
        language: payload.template.language,
        templateType: payload.templateType,
      },
      endUserIds: endUserIds,
    };
  }

  private handleInvalidChannelError(): Observable<never> {
    return throwError('Invalid channel or channel type.');
  }

  sendMessageTemplate(payload: any, channelId: string, selectedUsers: EnrolledEndUser[]): Observable<any> {
    return this._channelsServ$.getSpecificChannel(channelId).pipe(
      first(),
      switchMap((channel) => {
        if (channel && channel.type) {
          this.channel = channel;
          const sendMessageReq = this.constructSendMessageReq(payload, channel, selectedUsers);
          return this.sendMessagesCallFunction(sendMessageReq);
        } else {
          return this.handleInvalidChannelError();
        }
      })
    );
  }

  addMessageTemplate(template: MessageTemplate, id?:string){
    return this._messageTemplateStore$$.add(template, id);
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

  
  getTemplateStatus(channelId: any): Observable<MessageStatusRes[]> {
    return this._channelsServ$.getSpecificChannel(channelId).pipe(
      first(),
      switchMap((channel) => {
        if (channel && channel.id) {
          this.channel = channel;
          const messageStatusReq: MessageStatusReq = {
            fields: ["name", "status", "category"],
            limit: 20,
            channelId: this.channel.id || ''
          };
          return this.statusCallFunction(messageStatusReq);
        } else {
          return this.handleInvalidChannelError();
        }
      })
    );
  }
  
}

