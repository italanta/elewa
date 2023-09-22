import { Injectable } from '@angular/core';

import { take, map } from 'rxjs/operators';

import { MessageTemplate } from '@app/private/model/message-template';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { MessageTemplateStore } from '../store/message-template.store'; 

@Injectable({
  providedIn: 'root',
})
export class MessageTemplateService {
  constructor(
    private _messageTemplateStore: MessageTemplateStore, 
    private _orgId$$: ActiveOrgStore
  ) {}

  getMessageTemplates$() {
    return this._messageTemplateStore.get();
  }

  createMessageTemplate(template: MessageTemplate) {
    return this._messageTemplateStore.createMessageTemplate(template);
  }

  updateMessageTemplate(template: MessageTemplate) {
    return this._messageTemplateStore.updateMessageTemplate(template);
  }

  deleteMessageTemplate(template: MessageTemplate) {
    return this._messageTemplateStore.deleteMessageTemplate(template);
  }

  getMessageTemplateOrg$() {
    return this._orgId$$.get().pipe(take(1), map((_org) => _org.id));
  }

  getMessageTemplateById(templateId: string) {
    return this._messageTemplateStore.getMessageTemplateById(templateId);
  }
}


