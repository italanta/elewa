import { Injectable } from "@angular/core";
import { DataStore } from "@ngfi/state";
import { DataService, Repository } from "@ngfi/angular";

import { map, of, switchMap, tap, throttleTime } from "rxjs";

import { Logger } from "@iote/bricks-angular";
import { Query } from '@ngfi/firestore-qbuilder';

import { Assessment, AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { ActiveOrgStore } from "@app/private/state/organisation/main";

import { ActiveAssessmentStore } from "./active-assessment.store";

@Injectable()
export class AssessmentQuestionStore extends DataStore<AssessmentQuestion> {
  protected store = 'assessment-questions-store';
  protected _activeRepo: Repository<AssessmentQuestion>;

  protected _activeAssessment: Assessment;

  constructor(private _org$$: ActiveOrgStore,
              private _assessment$$: ActiveAssessmentStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const query = new Query().orderBy("createdOn","asc");

    const data$ = this._assessment$$.get().pipe(
                    tap((_assessment: Assessment) => this._activeAssessment = _assessment),
                    tap((_assessment: Assessment) => this._activeRepo = this._repoFac.getRepo<AssessmentQuestion>(`orgs/${_assessment.orgId}/assessments/${_assessment.id}/questions`)),
                    switchMap((_assessment: Assessment) => 
                      _assessment ? this._activeRepo.getDocuments(query): of([] as AssessmentQuestion[])),
                    throttleTime(400, undefined, { leading: true, trailing: true}));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    })
  }

  getQuestionsByAssessment(assessmentId: string)
  {
    const repo = this._repoFac.getRepo<AssessmentQuestion>(`orgs/${this._activeAssessment.orgId}/assessments/${assessmentId}/questions`);
    return repo.getDocuments();
  }

  createAssessmentQuestion(assessmentId: string, question: AssessmentQuestion, questionId: string) {
    return this._org$$.get().pipe(map((org) => {return {...question, orgId: org.id}}),
                                  tap((question) => {this._activeRepo = this._repoFac.getRepo<AssessmentQuestion>(`orgs/${question.orgId}/assessments/${assessmentId}/questions`)}),
                                  switchMap((question) => this._activeRepo.write(question, questionId))).subscribe();
  }
}
