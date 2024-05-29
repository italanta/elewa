import { Component, OnInit } from '@angular/core';
import { PassCriteriaTypes } from '@app/model/convs-mgr/stories/blocks/messaging';

import { Observable } from 'rxjs';
import { SetAssessmentScoreService } from '../../services/set-pass-status.service';
@Component({
  selector: 'app-assessment-result-banner',
  templateUrl: './assessment-result-banner.component.html',
  styleUrls: ['./assessment-result-banner.component.scss'],
})
export class AssessmentResultBannerComponent implements OnInit {

  passCriteria$: Observable <PassCriteriaTypes>

  constructor( private _assessmentScoreServ: SetAssessmentScoreService){}

  ngOnInit(): void {
    this.passCriteria$ = this._assessmentScoreServ.getAssessmentScore();
  }
  
}
