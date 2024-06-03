import { Injectable } from '@angular/core';
import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { of } from 'rxjs';
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { Organisation } from '@app/model/organisation';
import { Fallback } from '@app/model/convs-mgr/fallbacks';

@Injectable()
export class FallbackStore extends DataStore<Fallback> {
  protected store = 'classroom-store';
  protected _activeRepo: Repository<Fallback>;

  private _activeOrg: Organisation;

  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.

  constructor(
    private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    _logger: Logger
  ) {
    super('always', _logger);

    const data$ = this._org$$.get().pipe(
      tap((org: Organisation) => (this._activeOrg = org)),
      // tap((org: Organisation) => (this._activeRepo = _repoFac.getRepo<Fallback>(`orgs/${org.id}/bots/${bot.id}fallbacks`))),
      tap((org: Organisation) => (this._activeRepo = _repoFac.getRepo<Fallback>(`orgs/${org.id}/fallbacks`))),
      switchMap((org: Organisation) =>
        org ? this._activeRepo.getDocuments() : of([] as Fallback[])
      ),

      throttleTime(500, undefined, { leading: true, trailing: true })
    );

    this._sbS.sink = data$.subscribe((properties) => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
}
