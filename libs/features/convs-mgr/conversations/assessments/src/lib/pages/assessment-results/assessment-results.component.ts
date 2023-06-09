import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { EndUserService } from '@app/state/convs-mgr/end-users';

import { ActiveAssessmentStore } from '@app/state/convs-mgr/conversations/assessments';
import { EndUserDetails } from '@app/state/convs-mgr/end-users';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss'],
})
export class AssessmentResultsComponent implements OnInit, OnDestroy {
  id: string;
  assessment$: Observable<Assessment>;
  assessment: Assessment;
  results: EndUserDetails[];

  private _sBs = new SubSink();

  constructor(
    private _activeAssessment: ActiveAssessmentStore,
    private _endUserService: EndUserService
  ) {}

  ngOnInit() {
    this._sBs.sink = this._activeAssessment.get().subscribe((assess) => this.assessment = assess);
    this._sBs.sink = this._endUserService.getUserDetailsAndTheirCursor().subscribe((results) => {
      this.results = this.filterData(results)
    });
  }

  filterData(results: EndUserDetails[]) {
    const data = results.filter(user => {
      if (!user.cursor[0].assessmentStack) return false
      
      const assessmentExists = user.cursor[0].assessmentStack.find(assess => assess.assessmentId === this.assessment.id)

      if (assessmentExists) return true
      else return false
    })

    return data
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
