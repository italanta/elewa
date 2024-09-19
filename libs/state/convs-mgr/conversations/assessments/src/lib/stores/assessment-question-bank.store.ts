import { Injectable } from "@angular/core";
import { DataStore } from "@ngfi/state";
import { DataService, Repository } from "@ngfi/angular";

import { of, switchMap, tap, throttleTime } from "rxjs";

import { Logger } from "@iote/bricks-angular";
import { Query } from '@ngfi/firestore-qbuilder';

import { AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { ActiveOrgStore } from "@app/private/state/organisation/main";
import { Organisation } from "@app/model/organisation";

@Injectable()
export class AssessmentQuestionBankStore extends DataStore<AssessmentQuestion> {
  protected store = 'assessment-question-bank-store';
  protected _activeRepo: Repository<AssessmentQuestion>;

  private _activeOrg: Organisation;

  constructor(private _org$$: ActiveOrgStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const query = new Query().orderBy("createdOn","asc");

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation ) => {this._activeRepo = _repoFac.getRepo<AssessmentQuestion>(`orgs/${org.id}/question-bank`)}),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as AssessmentQuestion[])),
                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    })
  }
}
