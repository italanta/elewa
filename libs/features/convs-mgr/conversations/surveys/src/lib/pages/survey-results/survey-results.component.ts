import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Timestamp } from 'firebase-admin/firestore';

import { Chart } from 'chart.js';
import { SubSink } from 'subsink';

import { Survey } from '@app/model/convs-mgr/conversations/surveys';
import { EndUserDetails } from '@app/state/convs-mgr/end-users';
import { SurveyQuestionService } from '@app/state/convs-mgr/conversations/surveys';

import { pieChartOptions } from '../../utils/chart.utils';

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.scss'],
})
export class SurveyResultsComponent implements OnInit, OnDestroy {
  chart: Chart;

  id: string;
  survey: Survey;

  dataSource: MatTableDataSource<EndUserDetails>;
  itemsLength: number
  surveyResults = ['index', 'name', 'phone', 'startedOn', 'finishedOn', 'score', 'scoreCategory'];
  pageTitle: string;

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
    private _surveyQuestion: SurveyQuestionService,
  ) {}

  ngOnInit() {
    this._sBs.sink = this._surveyQuestion.getQuestions$().subscribe((qstns) => this.totalQuestions = qstns.length);
  };

  private initDataSource(data:EndUserDetails[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sortingDataAccessor = (endUser, property) => {
      switch(property) {
        case 'phoneNumber': 
          return endUser.user.phoneNumber;
        case 'startedOn': 
          return endUser.selectedSurveyCursor?.startedOn;
        case 'finishedOn': 
          return endUser.selectedSurveyCursor?.finishedOn;
        default:
          return endUser[property];
      }
    };

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private _loadChart(chartData: number[]) {
    // don't generate graph if no data is present
    const isData = chartData.find(score => score > 1)

    if (this.chart) this.chart.destroy();

    if (!isData) {
      return this._drawEmptyChart();
    };

    return new Chart('chart-ctx', {
      type: 'pie',
      data: {
        labels: ['Pass (75-100)','Average (50-74)', 'In Progress', 'Below Average (35-49)','Fail (0-34)'],
        datasets: [{
          data: chartData,
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
      options: pieChartOptions
    });
  }

  private _drawEmptyChart() {
    return new Chart('chart-ctx', {
      type: 'doughnut',
      data: {
        labels: ['No Metrics Available'],
        datasets: [{
          data: [100],
          backgroundColor: ['rgba(128, 128, 128, 1)'],
          hoverOffset: 4
        }]
      },
      options: pieChartOptions
    })
  }

  computeScores(scores:number[]) {
    if (!scores.length) return;

    this.highestScore = Math.max(...scores);
    this.lowestScore = Math.min(...scores);

    const sum = scores.reduce((prev, next) => prev + next);
    this.averageScore = (sum/scores.length).toFixed(2);
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
    this._router.navigate(['/surveys'])
  }

  edit() {
    this._router.navigate(['/surveys', this.survey.id], { queryParams: { mode: 'edit' }})
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
    this.chart?.destroy();
  }
}
