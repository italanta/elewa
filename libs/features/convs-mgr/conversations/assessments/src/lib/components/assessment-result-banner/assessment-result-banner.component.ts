import { Component, Input, OnInit } from '@angular/core';

import { Observable, pipe, take } from 'rxjs';
import { SubSink } from 'subsink';

import { SetAssessmentScoreService } from '../../services/set-pass-status.service';

@Component({
  selector: 'app-assessment-result-banner',
  templateUrl: './assessment-result-banner.component.html',
  styleUrls: ['./assessment-result-banner.component.scss'],
})
export class AssessmentResultBannerComponent implements OnInit 
{

  passCriteria$: Observable <number>;
  @Input() userAttempts: number;
  score: number

  private _sBS = new SubSink ()
  constructor( private _assessmentScoreServ: SetAssessmentScoreService){}

  ngOnInit(): void {
   this._sBS.sink = this._assessmentScoreServ.getAssessmentScore().pipe(take(1))
      .subscribe(_passScores => {
        console.log(_passScores)
        this.score = _passScores
      });
  }
  
}
