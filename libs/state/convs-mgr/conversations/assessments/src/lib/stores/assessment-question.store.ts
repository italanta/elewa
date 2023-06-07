import { DataStore } from "@ngfi/state";
import { DataService, Repository } from "@ngfi/angular";

import { Logger } from "@iote/bricks-angular";
import { of, switchMap, tap, throttleTime } from "rxjs";

import { Assessment, AssessmentQuestion } from "@app/model/convs-mgr/conversations/assessments";

import { ActiveAssessmentStore } from "./active-assessment.store";
import { Injectable } from "@angular/core";

@Injectable()
export class AssessmentQuestionStore extends DataStore<AssessmentQuestion> {
  protected store = 'assessment-questions-store';
  protected _activeRepo: Repository<AssessmentQuestion>;

  protected _activeAssessment: Assessment;

  constructor(private _assessment$$: ActiveAssessmentStore,
              private _repoFac: DataService,
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = this._assessment$$.get().pipe(
                    tap((_assessment: Assessment) => this._activeAssessment = _assessment),
                    tap((_assessment: Assessment) => this._activeRepo = this._repoFac.getRepo<AssessmentQuestion>(`orgs/${_assessment.orgId}/assessments/${_assessment.id}/questions`)),
                    switchMap((_assessment: Assessment) => 
                      _assessment ? this._activeRepo.getDocuments(): of([] as AssessmentQuestion[])),
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
}
