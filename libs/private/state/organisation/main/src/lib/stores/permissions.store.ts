import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';
import { Repository, DataService } from '@ngfi/angular';
import { Store } from '@iote/state';

import { CLMPermissions } from '@app/model/organisation';

import { ActiveOrgStore } from './active-org.store';
import { defaultPermissions } from 'libs/private/functions/organisation/src/lib/default-permissions';

@Injectable()

/**
 * This store contains the permissions for the active organisation.
 *    Permissions are stored in the organisation's config repo: 
 *          orgs/{orgId}/config/permissions
 */
export class PermissionsStore extends Store<CLMPermissions>
{
  protected store = 'permissions-store';
  protected _activeRepo: Repository<CLMPermissions>;
  CompaniesFeature: any;

  constructor(_activeOrg$$: ActiveOrgStore,
              private _dataProvider: DataService,
              protected _logger: Logger)
  {
    super(null as any);

    // Permissions are stored in the organisation's config repo: orgs/{orgId}/config/permissions
    const data$
      = _activeOrg$$.get()
            .pipe(tap(org  => this._activeRepo = org ? _dataProvider.getRepo<CLMPermissions>(`orgs/${org.id}/config`) : null as any),
                  switchMap(() => this._activeRepo ? this._activeRepo.getDocumentById('permissions') : of()));

    this._sbS.sink = data$.subscribe(permissions => {
      this.set(permissions as CLMPermissions);
    });
  }

  override get = () => super.get().pipe(filter((cts) => !!cts));

  update(permissions: CLMPermissions) {
    if(this._activeRepo){
      permissions.id = 'permissions';
      return this._activeRepo.update(permissions);
    }
    throw new Error('Permissions state not avaialable.');
  }

  createInitialDoc() {
    let repo =  this._dataProvider.getRepo<CLMPermissions>(`orgs/mGwoKfi1aLNcvax6vrZwPUEHPO93/config`);

    repo.write(defaultPermissions as any, 'permissions').subscribe();
  }
}