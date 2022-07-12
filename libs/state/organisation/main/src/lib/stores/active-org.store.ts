import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Store } from '@iote/state';

import { Organisation } from '@app/model/organisation';
import { OrgStore } from './organisation.store';

@Injectable()
export class ActiveOrgStore extends Store<Organisation>
{
  protected store = 'active-org-store';
  _activeOrg : string;

  constructor(_orgStore: OrgStore,
              _router: Router)
  {
    super(null);

    const orgs$ = _orgStore.get();
    const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
                                       map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([orgs$,  route$])
                        .subscribe(([orgs, route]) =>
    {
      const orgId = this._getRoute(route);

      if(orgId !== '__noop__')
      {
        const org = orgs.find(o => o.id === orgId);

        if(org && this._activeOrg !== orgId)
        {
          this._activeOrg = orgId;
          this.set(org, 'UPDATE - FROM DB || ROUTE');
        }
      }

    });
  }

  private _getRoute(route: NavigationEnd) : string
  {
    const elements = route.url.split('/');
    const propId = elements.length >= 3 ? elements[2] : '__noop__';

    return propId;
  }

  override get = () => super.get().pipe(filter(val => val != null));


  /** Warning - Hack. Only use in property creation onboarding.
   *                  Avoids challenge of already creating organisation-owned objects before navigating to org. */
  __setTemp(org: Organisation) {
    this._activeOrg = org.id;
    this.set(org, 'UPDATE - FROM DB || ROUTE');
  }
}
