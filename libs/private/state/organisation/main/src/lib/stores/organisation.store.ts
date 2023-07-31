import { Injectable, OnDestroy } from '@angular/core';

import { User } from '@iote/bricks';
import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';
import { Query } from '@ngfi/firestore-qbuilder';

import { UserStore } from '@app/private/state/user/base';

import { Organisation } from '@app/model/organisation';
import { iTalUser } from '@app/model/user';

@Injectable()
export class OrgStore extends DataStore<Organisation> implements OnDestroy
{
  protected store = 'org-store';
  protected _activeRepo: Repository<Organisation>;

  private _activeUser: User;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_userService: UserStore,
              _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    this._activeRepo = _repoFac.getRepo<Organisation>('orgs');

    const data$ = _userService.getUser()
                              .pipe(switchMap((user: iTalUser) => user ? this._activeRepo.getDocuments(this._getOrgUsers(user)) : []),
                                    throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  private _getOrgUsers(user: iTalUser): Query
  {
    let q = new Query();

    q = q.where('users', 'array-contains', user.id);

    return q;
  }


  private _getDefaultOrg(u: User) : Organisation | null 
  {
    if(!u) return null;

    return {
      id: u.id,
      name: u.displayName ?? 'Unidentified',
      users: [],
      roles: [],
      permissions: {}
    };
  }

  /** Updates organisation information.
   *  @warning - Do not to be used directly during onboarding and registration phase.
   *             Only to be used directly for minor data-field related updates.
   */
  override update = (prop: Organisation) => super.update(prop);

  /** Create an org
  *  @warning - Never to be used directly. */
  override add = (org: Organisation, id?: string) => super.add(org, id);

  /**
   * Get an org by id regardless of if logged in user has access.
   *
   * @warning Only to be used in situations where user is added to a org.
   */
  __getOneRegardless(orgId: string)
  {
    return this._activeRepo.getDocumentById(orgId);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}