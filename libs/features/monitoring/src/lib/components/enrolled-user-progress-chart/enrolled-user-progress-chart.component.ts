import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { Observable, combineLatest } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { GroupProgressModel, Periodicals } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService, ProgressMonitoringState } from '@app/state/convs-mgr/monitoring';

import { getEnrolledUsersCurrentMonth, getEnrolledUsersCurrentWeek, getLabels } from '../../providers/helper-fns.util';

@Component({
  selector: 'app-enrolled-user-progress-chart',
  templateUrl: './enrolled-user-progress-chart.component.html',
  styleUrls: ['./enrolled-user-progress-chart.component.scss'],
})
export class EnrolledUserProgressChartComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  @Input() progress$: Observable<{scopedProgress: GroupProgressModel[], allProgress: GroupProgressModel[]}>;
  @Input() period$: Observable<Periodicals>;
  @Input() isLast$: Observable<boolean>;
  
  chart: Chart;

  activeCourse: string;
  activeClassroom: string;
  selectedPeriodical: Periodicals;

  private _state$$: ProgressMonitoringState;

  showData = false;

  allProgress: GroupProgressModel[];
  dailyProgress: GroupProgressModel[];
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];

  currentWeekCount = 0;
  currentMonthCount = 0;

  constructor(private _progressService: ProgressMonitoringService) {
    this._state$$ = _progressService.getProgressState();
  }

  ngOnInit(): void {
    this.getProgressData();
  }

  getProgressData() {
    this._sBs.sink = combineLatest([this.period$, this.progress$, this.isLast$])
        .subscribe(([period, progress, isLast])=> {
          this.selectedPeriodical = period;
          if(progress.scopedProgress.length > 0) {
            this.showData = true;
          } else {
            this.showData = false;
          }

          this.currentWeekCount = getEnrolledUsersCurrentWeek(progress.allProgress);
          this.currentMonthCount = getEnrolledUsersCurrentMonth(progress.allProgress);

          this.chart = this._loadChart(progress.scopedProgress, isLast);
        })
  }

  private _loadChart(models: GroupProgressModel[], isLast: boolean) {
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('user-chart', {
      type: 'bar',
      data: {
        labels: getLabels(models, this.selectedPeriodical, isLast),
        datasets: [
          {
            label: `Enrolled User's`,
            data: this.getData(models),
            backgroundColor: '#517B15',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        normalized: true,
        plugins: {
          title: {
            display: true,
            text: 'Users enrollment',
            font: {size: 14, weight: 'normal'}
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxWidth: 12,
              useBorderRadius: true,
              borderRadius: 6
            },
          
          },

        },
        scales: {
          x: { 
            stacked: true, 
            grid: {display: false} ,
            ticks: { 
              maxTicksLimit: 12,
              autoSkip: false
            },
          },
          y: { 
            stacked: true, 
            grid: {color: '#F0F0F0'},  
            ticks: { 
              maxTicksLimit: 6, 
              autoSkip: true 
            }},
        },
      },
    });
  }

  private getData(models: GroupProgressModel[]): number[] {
    if (this.selectedPeriodical === 'Daily') {
      return models.map((mod) => mod.todaysEnrolledUsersCount.dailyCount);
    } else if (this.selectedPeriodical === 'Weekly') {
      const weeklyData = models.map((mod) => mod.todaysEnrolledUsersCount.pastWeekCount);
      weeklyData.push(this.currentWeekCount);
      return weeklyData;
    } else {
      const monthlyData = models.map((mod) => mod.todaysEnrolledUsersCount.pastMonthCount);
      monthlyData.push(this.currentMonthCount);
      return monthlyData;
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }

    this._sBs.unsubscribe();
  }
}
