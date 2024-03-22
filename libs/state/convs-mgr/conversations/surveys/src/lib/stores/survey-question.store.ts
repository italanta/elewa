import { Injectable } from "@angular/core";
import { DataStore } from "@ngfi/state";
import { DataService, Repository } from "@ngfi/angular";

import { map, of, switchMap, tap, throttleTime } from "rxjs";

import { Logger } from "@iote/bricks-angular";
import { Query } from '@ngfi/firestore-qbuilder';

import { Survey, SurveyQuestion } from "@app/model/convs-mgr/conversations/surveys";
import { ActiveOrgStore } from "@app/private/state/organisation/main";

import { ActiveSurveyStore } from "./active-survey.store";

@Injectable()
export class SurveyQuestionStore extends DataStore<SurveyQuestion> {
  protected store = 'survey-questions-store';
  protected _activeRepo: Repository<SurveyQuestion>;

  protected _activeSurvey: Survey;

  constructor(private _org$$: ActiveOrgStore,
              private _survey$$: ActiveSurveyStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const query = new Query().orderBy("createdOn","asc");

    const data$ = this._survey$$.get().pipe(
                    tap((_survey: Survey) => this._activeSurvey = _survey),
                    tap((_survey: Survey) => this._activeRepo = this._repoFac.getRepo<SurveyQuestion>(`orgs/${_survey.orgId}/surveys/${_survey.id}/questions`)),
                    switchMap((_survey: Survey) => 
                      _survey ? this._activeRepo.getDocuments(query): of([] as SurveyQuestion[])),
                    throttleTime(400, undefined, { leading: true, trailing: true}));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    })
  }

  getQuestionsBySurvey(surveyId: string)
  {
    const repo = this._repoFac.getRepo<SurveyQuestion>(`orgs/${this._activeSurvey.orgId}/surveys/${surveyId}/questions`);
    return repo.getDocuments();
  }

  createSurveyQuestion(surveyId: string, question: SurveyQuestion, questionId: string) {
    return this._org$$.get().pipe(map((org) => {return {...question, orgId: org.id}}),
                                  tap((question) => {this._activeRepo = this._repoFac.getRepo<SurveyQuestion>(`orgs/${question.orgId}/surveys/${surveyId}/questions`)}),
                                  switchMap((question) => this._activeRepo.write(question, questionId))).subscribe();
  }
}
