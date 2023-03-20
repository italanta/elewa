import { Injectable } from '@angular/core';

import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { User } from '@iote/bricks';
import { Store } from '@iote/state';

import { UserStore } from '@app/state/user';
import { Organisation } from '@app/model/organisation';

import { OrgStore } from './organisation.store';

@Injectable()
export class ActiveOrgStore extends Store<Organisation>
{
  protected store = 'active-org-store';
  _activeOrg : string;

  constructor(_orgStore: OrgStore,
              _user$$: UserStore)
              // _router: Router)
  {
    super(null as any);

    const orgs$ = _orgStore.get();
    // const route$ = _router.events.pipe(filter((ev: Event) => ev instanceof NavigationEnd),
    //                                    map(ev => ev as NavigationEnd));

    this._sbS.sink = combineLatest([orgs$, _user$$.getUser()]) // route$])
                        .subscribe(([orgs, user]) => //route
    {
      const orgId = (user as User).id as string;

      const org = orgs.find(o => o.id === orgId);
      if(org && this._activeOrg !== orgId)
      {
        this._activeOrg = orgId;
        this.set(org, 'UPDATE - FROM DB || ROUTE');
      }

      // const orgId = this._getRoute(route);

      // if(orgId !== '__noop__')
      // {
      //   const org = orgs.find(o => o.id === orgId);

      //   if(org && this._activeOrg !== orgId)
      //   {
      //     this._activeOrg = orgId;
      //     this.set(org, 'UPDATE - FROM DB || ROUTE');
      //   }
      // }

    });
  }

  // private _getRoute(route: NavigationEnd) : string
  // {
  //   const elements = route.url.split('/');
  //   const propId = elements.length >= 3 ? elements[2] : '__noop__';

  //   return propId;
  // }

  override get = () => super.get().pipe(filter(val => val != null));

  // /** Warning - Hack. Only use in property creation onboarding.
  //  *                  Avoids challenge of already creating organisation-owned objects before navigating to org. */
  // __setTemp(org: Organisation) {
  //   this._activeOrg = org.id as string;
  //   this.set(org, 'UPDATE - FROM DB || ROUTE');
  // }
}
