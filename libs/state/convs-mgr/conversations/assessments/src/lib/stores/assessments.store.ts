import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable()
export class AssessmentsStore extends DataStore<Assessment>
{
  protected store = 'assessments-store';
  protected _activeRepo: Repository<Assessment>;

  private _activeOrg: Organisation;
  
  constructor(private _org$$: ActiveOrgStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation ) => {this._activeRepo = _repoFac.getRepo<Assessment>(`orgs/${org.id}/assessments`)}),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as Assessment[])),
                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }

  createAssessment (assessment: Assessment) {
    return this._org$$.get().pipe(map((org) => {return {...assessment, orgId: org.id}}),
                            tap((assessment) => {this._activeRepo = this._repoFac.getRepo<Assessment>(`orgs/${assessment.orgId}/assessments`)}),
                                switchMap((assessment) => this._activeRepo.create(assessment)));
  }
}
