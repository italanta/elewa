import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';
import { Logger } from '@iote/bricks-angular';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Organisation } from '@app/model/organisation';
import { Survey } from '@app/model/convs-mgr/conversations/surveys';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable()
export class SurveysStore extends DataStore<Survey>
{
  protected store = 'survey-store';
  protected _activeRepo: Repository<Survey>;

  private _activeOrg: Organisation;
  
  constructor(private _org$$: ActiveOrgStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation ) => {this._activeRepo = _repoFac.getRepo<Survey>(`orgs/${org.id}/surveys`)}),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as Survey[])),
                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
