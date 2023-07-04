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
  assessmentResults = ['index', 'name', 'phone', 'startedOn', 'finishedOn', 'score', 'scoreCategory'];
  pageTitle: string;

  scores: number[] = [];
  highestScore: number;
  lowestScore: number;
  averageScore: number | string;

  totalQuestions: number;

  failedCount = 0;
  passedCount = 0;
  averageCount = 0;
  inProgressCount = 0;
  belowAverageCount = 0;

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
    this._sBs.sink = this._activeAssessment$$.get().subscribe((assess) => {
      this.assessment = assess
      this.pageTitle = `Assessments / ${assess.title} / results`;
    });

    this._sBs.sink = this._assessmentQuestion.getQuestions$().subscribe((qstns) => this.totalQuestions = qstns.length);
    this._sBs.sink = this._endUserService.getUserDetailsAndTheirCursor().subscribe((results) => {
      const data = this.filterData(results);
      this.itemsLength = data.length;

      this.initDataSource(data);
      this.computeScores();
      this._loadChart();
    });
  };

  private initDataSource(data:EndUserDetails[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sortingDataAccessor = (endUser, property) => {
      switch(property) {
        case 'phoneNumber': 
          return endUser.user.phoneNumber;
        case 'startedOn': 
          return endUser.selectedAssessmentCursor?.startedOn;
        case 'score': 
          return endUser.selectedAssessmentCursor?.score;
        case 'finishedOn': 
          return endUser.selectedAssessmentCursor?.finishedOn;
        default:
          return endUser[property];
      }
    };

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private _loadChart() {
    // don't generate graph if no data is present
    if (!this.passedCount && !this.averageCount && !this.failedCount && !this.belowAverageCount) return;

    if (this.chart) this.chart.destroy();

    return new Chart('chart-ctx', {
      type: 'pie',
      data: {
        labels: ['Pass (75-100)','Average (50-74)', 'In Progress', 'Below Average (35-49)','Fail (0-34)'],
        datasets: [{
          data: [this.passedCount, this.averageCount, this.inProgressCount, this.belowAverageCount, this.failedCount],
          backgroundColor: [
            'rgb(0, 144, 0)',
            'rgb(100, 24, 195)',
            'rgb(2, 179, 254)',
            'rgb(255, 171, 45)',
            'rgb(255, 0, 0)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        normalized: true,
        plugins: {
          legend: {
            position: 'right',
            labels : {
              usePointStyle: true,
              padding: 25,
            }
          },
          tooltip: {
            callbacks: {
              label(context) {
                const sum = context.dataset.data.reduce((sum, value) => sum + value);

                const value = context.raw as number;
                const percentage = Math.round((value / sum) * 100);
  
                return `learners ${value} (${percentage}%)`;
              }
            }
          }
        },
      },
    });
  }

  /** Returns a list of users that have attempted the assessment */
  filterData(results: EndUserDetails[]) {
    const data = results.filter(user => {
      if (!user.cursor[0].assessmentStack) return false

      const assessExists = user.cursor[0].assessmentStack.find(assess => assess.assessmentId === this.assessment.id)

      if (assessExists) {
        user.scoreCategory = this.getScoreCategory(assessExists);
        user.selectedAssessmentCursor = assessExists
        this.scores.push(assessExists.score);
        return true
      }

      else return false
    })

    return data
  }

  computeScores() {
    if (!this.scores.length) return;

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

  formatDate(timeStamp: Timestamp): string {
    if (!timeStamp) return 'In progress';
    const date = new Date(timeStamp.seconds * 1000);

    const year = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return  `${year} ${time}`;
  }

  modifyTitle(title: string) {
    const firstChar = title.charAt(0).toUpperCase();
    const restChars = title.slice(1).toLowerCase();

    return `${firstChar}${restChars}`
  }

  getScoreCategory(assessmentCursor: AssessmentCursor) {
    if (!assessmentCursor.finishedOn) {
      this.inProgressCount++
      return 'In progress'
    }

    const finalScore = assessmentCursor.score;
    const finalPercentage = (assessmentCursor.maxScore == 0 ? 0 : (finalScore/assessmentCursor.maxScore)) * 100;

    if (finalPercentage >= 0 && finalPercentage < 34) {
      this.failedCount++
      return 'Failed';
    } else if (finalPercentage >= 50 && finalPercentage <= 75) {
      this.averageCount++
      return 'Average';
    } else if (finalPercentage >= 35 && finalPercentage <= 49) {
      this.belowAverageCount++
      return 'Below Average'
    } else {
      this.passedCount++
      return 'Pass';
    }
  }

  addClass(endUser: EndUserDetails) {
    if (endUser.scoreCategory === 'In progress') {
      return 'in-progress'
    } else if (endUser.scoreCategory === 'Below Average') {
      return 'below-average'
    } else return endUser.scoreCategory
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  goBack() {
    this._router.navigate(['/assessments'])
  }

  edit() {
    this._router.navigate(['/assessments', this.assessment.id], { queryParams: { mode: 'edit' }})
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
    this.chart?.destroy();
  }
}
