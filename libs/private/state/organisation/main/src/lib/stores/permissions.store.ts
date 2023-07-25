import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Repository, DataService } from '@ngfi/angular';

import { ActiveOrgStore } from '@app/state/organisation';

import { Store } from '@iote/state';
import { CLMPermissions } from '@app/model/organisation';

@Injectable()
export class PermissionsStore extends Store<CLMPermissions>
{
  protected store = 'permissions-store';
  protected _activeRepo: Repository<CLMPermissions>;
  CompaniesFeature: any;

  constructor(_activeOrg$$: ActiveOrgStore,
              _dataProvider: DataService,
              protected _logger: Logger)
  {
    super(null as any);

    const data$
      = _activeOrg$$.get()
            .pipe(tap(o  => this._activeRepo = !!o ? _dataProvider.getRepo<CLMPermissions>(`orgs/${o.id}/config`) : null as any),
                  switchMap(o => !!this._activeRepo ? this._activeRepo.getDocumentById('permissions') : of()));

    this._sbS.sink = data$.subscribe(permissions => {
      this.set(permissions as CLMPermissions);
    });
  } 

  override get = () => super.get().pipe(filter((cts, i) => !!cts));

  create (permissions: any) {
    if(this._activeRepo){
      permissions.id = 'permissions';
      return this._activeRepo.update(permissions).subscribe((success) => success);
    }

    throw new Error('Permissions state not avaialable.');

  }
}