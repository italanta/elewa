import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Chart } from 'chart.js';
import { SubSink } from 'subsink';
import { Timestamp } from 'firebase-admin/firestore';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { EndUserService } from '@app/state/convs-mgr/end-users';
import { EndUserDetails } from '@app/state/convs-mgr/end-users';
import { ActiveAssessmentStore, AssessmentQuestionService } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentCursor } from '@app/model/convs-mgr/conversations/admin/system';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss'],
})
export class AssessmentResultsComponent implements OnInit, OnDestroy {
  chart: Chart;

  id: string;
  assessment: Assessment;

  dataSource: MatTableDataSource<EndUserDetails>;
  itemsLength: number
  assessmentResults = ['name', 'phone', 'startedOn', 'finishedOn', 'score', 'scoreCategory'];
  pageTitle: string;

  scores: number[] = [];
  highestScore: number;
  lowestScore: number;
  averageScore: number | string;

  totalQuestions: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _sBs = new SubSink();

  constructor(
    private _router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private _activeAssessment$$: ActiveAssessmentStore,
    private _assessmentQuestion: AssessmentQuestionService,
    private _endUserService: EndUserService
  ) {}

  ngOnInit() {
    this.pageTitle = `Assessments/${this.assessment?.title}/results`;
    this._sBs.sink = this._activeAssessment$$.get().subscribe((assess) => this.assessment = assess);
    this._sBs.sink = this._assessmentQuestion.getQuestions$().subscribe((qstns) => this.totalQuestions = qstns.length);

    this._sBs.sink = this._endUserService.getUserDetailsAndTheirCursor().subscribe((results) => {
      const data = this.filterData(results);
      this.itemsLength = data.length;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.computeScores();
      this._loadChart();
    });
  };

  private _loadChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('chart-ctx', {
      type: 'pie',
      data: {
        labels: ['Pass (75-100)','Average','Below Average', 'Fail'],
        datasets: [{
          label: 'count',
          data: [200, 50, 80, 50],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(25, 105, 86)',
          ],
          hoverOffset: 4
        }]
      },

      options: {
        maintainAspectRatio: false,
        responsive: true,
        normalized: true,
        plugins: {
          // title: {
          //   display: true,
          //   text: 'Assessment progression',
          // },
          legend: {
            position: 'right',
            labels : {
              usePointStyle: true
            }
          }
        },
      },
    });
  }

  filterData(results: EndUserDetails[]) {
    const data = results.filter(user => {
      if (!user.cursor[0].assessmentStack) return false

      const assessExists = user.cursor[0].assessmentStack.find(assess => assess.assessmentId === this.assessment.id)

      if (assessExists) {
        user.selectedAssessmentCursor = assessExists
        this.scores.push(assessExists.score);
        return true
      }

      else return false
    })

    return data
  }

  computeScores() {
    this.highestScore = Math.max(...this.scores);
    this.lowestScore = Math.min(...this.scores);

    const sum = this.scores.reduce((prev, next) => prev + next);
    this.averageScore = (sum/this.scores.length).toFixed(2);
  };

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  formatDate(time: Timestamp): string {
    if (!time) return 'In progress';

    const date = new Date(time.seconds * 1000);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear());
  }

  getScoreCategory(assessmentCursor: AssessmentCursor) {
    if (!assessmentCursor.finishedOn) return 'In progress';

    const finalScore = assessmentCursor.score;
    const finalPercentage = (assessmentCursor.maxScore == 0 ? 0 : (finalScore/assessmentCursor.maxScore)) * 100;

    if (finalPercentage >= 0 && finalPercentage < 50) {
      return 'Failed';
    } else if (finalPercentage >= 50 && finalPercentage <= 75) {
      return 'Average';
    } else {
      return 'Pass';
    }
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  goBack() {
    this._router.navigate(['/assessments'])
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
    this.chart?.destroy();
  }
}
