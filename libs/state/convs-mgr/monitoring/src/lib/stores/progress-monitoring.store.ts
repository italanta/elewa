import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { ActiveOrgStore } from '@app/state/organisation';
import { GroupProgressModel } from '@app/model/analytics/group-based/progress';

@Injectable()
export class ProgressMonitoringStore extends DataStore<GroupProgressModel>
{
  protected store = 'monitoring-store';
  protected _activeRepo: Repository<GroupProgressModel>;

  private _activeOrg: Organisation;

  constructor(_org$$: ActiveOrgStore,
              _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<GroupProgressModel>(`orgs/${org.id}/monitoring`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as GroupProgressModel[])
                      ),
                      throttleTime(500, undefined, { leading: true, trailing: true })
                    );

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
