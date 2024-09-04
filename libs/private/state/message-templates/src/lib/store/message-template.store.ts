import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';
import { Query } from '@ngfi/firestore-qbuilder';

import { Logger } from '@iote/bricks-angular';

import { tap, throttleTime, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { Organisation } from '@app/model/organisation';
import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { TemplateMessage } from '@app/model/convs-mgr/conversations/messages';

@Injectable()
export class MessageTemplateStore extends DataStore<TemplateMessage> {
  protected store = 'message-templates-store';
  protected _activeRepo: Repository<TemplateMessage>;

  private _activeOrg: Organisation;

  query = new Query().where('channelId', '!=', null)

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
          this._activeRepo = this._repoFac.getRepo<TemplateMessage>(
            `orgs/${org.id}/message-templates`
          );
        }),
        switchMap((org: Organisation) =>
          org
            ? this._activeRepo.getDocuments(this.query)
            : of([] as TemplateMessage[])
        ),
        throttleTime(500, undefined, { leading: true, trailing: true })
      );

    this._sbS.sink = data$.subscribe((properties) => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}