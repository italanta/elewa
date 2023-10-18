import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';

import { ActiveOrgStore } from '@app/state/organisation';
import { extend } from 'lodash';
import { IObject } from '@iote/bricks';


export interface Label extends IObject {
  name: string,
  color: string,
  desc: string
}

@Injectable()
export class LabelsStore extends DataStore<Label>
{
  protected store = 'labels-store';
  protected _activeRepo: Repository<Label>;

  private _activeOrg: Organisation;
  
  constructor(_org$$: ActiveOrgStore,
              _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<Label>(`orgs/${org.id}/labels`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as Label[])),
                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
