import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/state/organisation';

@Injectable()
export class AssessmentsStore extends DataStore<Assessment>
{
  protected store = 'assessments-store';
  protected _activeRepo: Repository<Assessment>;

  private _activeOrg: Organisation;
  
  constructor(_org$$: ActiveOrgStore,
              _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation ) => {this._activeRepo = _repoFac.getRepo<Assessment>(`orgs/${org.id}/assessments`)}),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as Assessment[])),
                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
