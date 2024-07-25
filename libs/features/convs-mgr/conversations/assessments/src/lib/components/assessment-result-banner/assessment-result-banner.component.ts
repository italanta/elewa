import { Component, Input, OnInit } from '@angular/core';

import { Observable, pipe, take } from 'rxjs';
import { SubSink } from 'subsink';

import { SetAssessmentScoreService } from '../../services/set-pass-status.service';
import { AssessmentProgress } from '@app/model/convs-mgr/micro-app/assessments';

@Component({
  selector: 'app-assessment-result-banner',
  templateUrl: './assessment-result-banner.component.html',
  styleUrls: ['./assessment-result-banner.component.scss'],
})
export class AssessmentResultBannerComponent implements OnInit 
{
  @Input() resultsMode: {
    failedAndNoRetries:  boolean,
    failedAndHasRetries: boolean,
    passedAndHasRetries: boolean,
    passedAndNoRetries : boolean,
  };

  @Input() result: AssessmentProgress;

  /** Learner score on this attempt in percentage */
  score: number
  /** Final score after all attempts in percentage */
  finalScore: number

  ngOnInit(): void 
  {
    this.score = Math.round((this.result.attempts[this.result.attemptCount].score / this.result.maxScore) * 100);
    this.finalScore = Math.round((this.result.finalScore / this.result.maxScore) * 100)
  }
  
}
