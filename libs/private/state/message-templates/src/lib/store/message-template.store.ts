import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';


import { of } from 'rxjs';
import { tap, throttleTime, switchMap, map } from 'rxjs/operators';
import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { MessageTemplate } from '@app/model/convs-mgr/functions';

@Injectable()
export class MessageTemplateStore extends DataStore<MessageTemplate> {
  protected store = 'message-templates-store';
  protected _activeRepo: Repository<MessageTemplate>;

  private _activeOrg: Organisation;

  constructor(
    private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    private _aff: AngularFireFunctions,
    _logger: Logger
  ) {
    super('always', _logger);

    const data$ = this._org$$
      .get()
      .pipe(
        tap((org: Organisation) => (this._activeOrg = org)),
        tap((org: Organisation) => {
          this._activeRepo = this._repoFac.getRepo<MessageTemplate>(
            `orgs/${org.id}/message-templates`
          );
        }),
        switchMap((org: Organisation) =>
          org
            ? this._activeRepo.getDocuments()
            : of([] as MessageTemplate[])
        ),
        throttleTime(500, undefined, { leading: true, trailing: true })
      );

    this._sbS.sink = data$.subscribe((properties) => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  createMessageTemplate(template: MessageTemplate) {
    return this._org$$
      .get()
      .pipe(
        tap((res)=>console.log("Hlloe worlls", res)),
        map((org) => ({ ...template, orgId: org.id })),
        tap((template) => {
          this._activeRepo = this._repoFac.getRepo<MessageTemplate>(
            `orgs/${template.orgId}/message-templates`
          );
        }),
        switchMap((template) => this._activeRepo.create(template))
      );
  }

  updateMessageTemplate(template: MessageTemplate) {
    return this._activeRepo.update(template); 
  }

  deleteMessageTemplate(template: MessageTemplate) {
    return this._activeRepo.delete(template); 
  }

  getMessageTemplateById(templateId: string) {
    return this._activeRepo.getDocumentById(templateId);
  }
}
