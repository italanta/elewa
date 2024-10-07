import { Component, Input, OnInit } from '@angular/core';

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
  /** Highest score attained by user */
  highScore: number;

  ngOnInit(): void 
  {
    this.score = this.result.attempts[this.result.attemptCount].finalScorePercentage as number;

    this.highScore = this.result.highestScore as number;
  }
}
