import { Injectable } from '@angular/core';
import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { combineLatest, of } from 'rxjs';
import { tap, throttleTime, switchMap, filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { Organisation } from '@app/model/organisation';
import { Fallback } from '@app/model/convs-mgr/fallbacks';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class FallbackStore extends DataStore<Fallback> {
  protected store = 'fallback-store';
  protected _activeRepo: Repository<Fallback>;

  private _activeOrg: Organisation;

  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.

  constructor(
    private _activeOrg$$: ActiveOrgStore,
    private _repoFac: DataService,
    _router: Router,
    _logger: Logger
  ) {
    super('always', _logger);
    const route$ = _router.events.pipe(filter((ev) => ev instanceof NavigationEnd),
    map(ev => ev as NavigationEnd));

    const activeOrg$ = _activeOrg$$.get();

    const data$ = activeOrg$.pipe(
      tap((org: Organisation) => (this._activeOrg = org)),
      // tap((org: Organisation) => (this._activeRepo = _repoFac.getRepo<Fallback>(`orgs/${org.id}/bots/iLKLgrwio1Qfd1b7spBl/fallbacks`))),
      tap((org: Organisation) => (this._activeRepo = _repoFac.getRepo<Fallback>(`orgs/${org.id}/fallbacks`))),
      switchMap((org: Organisation) =>
        org ? this._activeRepo.getDocuments() : of([] as Fallback[])
      ),

      throttleTime(500, undefined, { leading: true, trailing: true })
    );


    this._sbS.sink = combineLatest([route$, data$]).subscribe(([route, data]) => {
      const botId = this._getRoute(route);

      const botFallbacks = data.filter((fallbacks)=> fallbacks.botId == botId);

      this.set(botFallbacks, 'UPDATE - FROM DB');
    });
  }

  private _getRoute(route: NavigationEnd) : string
  {
    const elements = route.url.split('/');
    const storyId = elements.length >= 3 ? elements[2] : '__noop__';

    return storyId;
  }
}
