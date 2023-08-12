import { Injectable, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { User } from '@iote/bricks';
import { Store } from '@iote/state';

import { UserStore } from '@app/private/state/user/base';
import { Organisation } from '@app/model/organisation';

import { OrgStore } from './organisation.store';

@Injectable()
export class ActiveOrgStore extends Store<Organisation> implements OnDestroy
{
  protected store = 'active-org-store';
  private _activeOrg : string;

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
      const org = orgs.find((orgs) =>  orgs.id == user.activeOrg && !orgs.archived) as Organisation;

      if (!user) {
        this._activeOrg = '__noop__';
        this.set(null as any, 'UPDATE - FROM USER');
      } else {
        this._activeOrg = org?.id as string;
        this.set(org);
      }
    });
  }

  override get = () => super.get().pipe(filter(val => val != null));

  setOrg(org: Organisation) {
    this.set({
      id: org.id,
      name: org?.name,
      address: org?.address,
      roles: org?.roles,
      users: org?.users,
    } as Organisation, 'UPDATE - FROM USER');
  }
  
  ngOnDestroy = () => this._sbS.unsubscribe();
}