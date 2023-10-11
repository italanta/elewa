import { Component, OnDestroy, OnInit } from '@angular/core';

import { map, switchMap } from 'rxjs';
import { SubSink } from 'subsink';

import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentMetricsService } from '@app/features/convs-mgr/conversations/assessments';

import { EndUserService } from '@app/state/convs-mgr/end-users';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentScore } from '../../models/assessment-score.interface';

@Component({
  selector: 'app-assessment-progress-chart',
  templateUrl: './assessment-progress-chart.component.html',
  styleUrls: ['./assessment-progress-chart.component.scss'],
})
export class AssessmentProgressChartComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  highestScore: number;
  lowestScore: number;
  averageScore: string;
  totalQuestions: number;
  assessments: Assessment[];
  assessmentScores: AssessmentScore[];

  selectedAssessment: Assessment;
  scoresComputed = false;

  constructor(
    private _assessmentServ$: AssessmentService,
    private _endUserService: EndUserService,
    private _aMetrics: AssessmentMetricsService
  ) {}

  ngOnInit(): void {
    this.getMetrics();
  }

  getMetrics() {
    this._sBs.sink = this._assessmentServ$
      .getAssessments$().pipe(switchMap((assessments) => {
          this.assessments = assessments;
  
          return this._endUserService.getUserDetailsAndTheirCursor().pipe(
            map((endUsers) => {
              return this.assessmentScores = assessments.map((assessment) => {
                const { scores } = this._aMetrics.computeMetrics(endUsers, assessment);
                return { assessment, scores } as AssessmentScore;
              });
            })
          );
        })
      )
      .subscribe((scores) => {
        this.assessmentScores = scores
        this.scoresComputed = true
      });
  }

  switchAssessmentScores() {
    const assessmentScore = this.assessmentScores.find(
      (assess) => assess.assessment.id === this.selectedAssessment.id
    ) as AssessmentScore;

    const scores = assessmentScore.scores;

    this.computeScores(scores);
  }

  computeScores(scores: number[]) {
    this.highestScore =  scores.length ? Math.max(...scores) : 0;

    this.lowestScore = scores.length ? Math.min(...scores) : 0;

    const sum = scores.reduce((prev, next) => prev + next, 0);

    this.averageScore = sum ? (sum / scores.length).toFixed(2) : '0';
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
