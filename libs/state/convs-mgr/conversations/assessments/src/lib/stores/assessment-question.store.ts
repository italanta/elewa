import { Injectable } from "@angular/core";
import { DataStore } from "@ngfi/state";
import { DataService, Repository } from "@ngfi/angular";

import { concatMap, from, map, of, switchMap, tap, throttleTime } from "rxjs";

import { Logger } from "@iote/bricks-angular";
import { Query } from '@ngfi/firestore-qbuilder';

import { Assessment, AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";
import { ActiveOrgStore } from "@app/private/state/organisation/main";

import { ActiveAssessmentStore } from "./active-assessment.store";
import { AssessmentProgress } from "@app/model/convs-mgr/micro-app/assessments";

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

  getQuestionsByAssessment(assessmentId: string, orgId?: string)
  {
    const org = orgId ? orgId : this._activeAssessment.orgId;

    const repo = this._repoFac.getRepo<AssessmentQuestion>(`orgs/${org}/assessments/${assessmentId}/questions`);
    return repo.getDocuments();
  }

  getAssessmentProgress(assessmentId: string, orgId: string, endUserId: string)
  {
    const repo = this._repoFac.getRepo<AssessmentProgress>(`orgs/${orgId}/end-users/${endUserId}/assessment-progress`);

    return repo.getDocumentById(assessmentId);
  }

  createAssessmentQuestion(assessmentId: string, question: AssessmentQuestion, questionId: string) {
    return this._org$$.get().pipe(map((org) => {return {...question, orgId: org.id}}),
                                  tap((question) => {this._activeRepo = this._repoFac.getRepo<AssessmentQuestion>(`orgs/${question.orgId}/assessments/${assessmentId}/questions`)}),
                                  switchMap((question) => this._activeRepo.write(question, questionId))).subscribe();
  }

  createAssessmentQuestions(assessmentIds: string[], questions: AssessmentQuestion[]){
    return from(assessmentIds).pipe(
      concatMap(assessmentId =>
        from(questions).pipe(
          map(question => ({...question, assessmentId})),
          tap(question => {
            this._org$$.get().pipe(
              map(org => this._repoFac.getRepo<AssessmentQuestion>(`orgs/${org.id}/assessments/${assessmentId}/questions`))
            ).subscribe(repo => this._activeRepo = repo);
          }),
          switchMap(question => this._activeRepo.write(question, question.id as string))
        )
      ),
      tap({
        complete: () => console.log('All questions created in all assessments')
      })
    );
  }
}
