import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';
import { Bot } from '@app/model/convs-mgr/bots';

import { periodicals } from '../../models/periodicals.interface';
import { formatDate, getDailyProgress, getMonthlyProgress, getWeeklyProgress } from '../../providers/helper-fns.util';

@Component({
  selector: 'app-user-engagement-chart',
  templateUrl: './user-engagement-chart.component.html',
  styleUrls: ['./user-engagement-chart.component.scss'],
})
export class UserEngagementChartComponent implements OnInit, OnDestroy {
  @Input() activeCourse: Bot;

  private _sBs = new SubSink();
  
  chart: Chart;

  activeClassroom: string;
  selectedPeriodical: periodicals;

  showData = false;

  allProgress: GroupProgressModel[];
  dailyProgress: GroupProgressModel[];
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];

  @Input()
  set setPeriodical(value: periodicals) {
    this.selectedPeriodical = value;
    this.selectProgressTracking(value);
  }

  constructor(private _progressService: ProgressMonitoringService) {}

  ngOnInit(): void {
    this.getProgressData();
  }

  getProgressData() {
    this._sBs.sink = this._progressService.getMilestones().subscribe((model) => {
      if (model.length) {
        this.showData = true;

        this.chart = this._loadChart(model);
        this.dailyProgress = getDailyProgress(model);
        this.weeklyProgress = getWeeklyProgress(model);
        this.monthlyProgress = getMonthlyProgress(model);

        this.chart = this._loadChart(this.weeklyProgress);
      }
    });
  }

  selectProgressTracking(periodical: periodicals) {
    if (!this.dailyProgress) return

    if (periodical === 'Daily') {
      this.chart = this._loadChart(this.dailyProgress);
    } else if (periodical === 'Weekly') {
      this.chart = this._loadChart(this.weeklyProgress);
    } else {
      this.chart = this._loadChart(this.monthlyProgress);
    }
  }

  private _loadChart(models: GroupProgressModel[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('user-engagement-chart', {
      type: 'line',
      data: {
        labels: models.map((day) => formatDate(day.time)),
        datasets: [
          {
            /** Line styling */
            label: `Active users`,
            data: this.getActiveUsers(models),
            tension: 0.6,
            borderWidth: 2,
            borderColor: '#00D0D6',
            backgroundColor: '#00D0D6',

            /** Line point styling */
            pointBorderWidth: 1,
            pointBackgroundColor: '#00D0D6',
          },

          {
            /** Line styling */
            label: `Active users`,
            data: this.getInactiveUsers(models),
            tension: 0.6,
            borderWidth: 2,
            borderColor: '#F1CC00',
            backgroundColor: '#F1CC00',

            /** Line point styling */
            pointBorderWidth: 1,
            pointBackgroundColor: '#F1CC00',
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
            text: 'Users engagement',
            font: {size: 14, weight: 'normal'}
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxWidth: 12,
              useBorderRadius: true,
              borderRadius: 6,
            },
          
          },

        },
        scales: {
          x: { 
            stacked: true, 
            grid: {display: false} ,
            ticks: { 
              maxTicksLimit: 12
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

  private getActiveUsers(models: GroupProgressModel[]): number[] {
    const userCountArray = [];

    for (const mod of models) {
      if(!mod.todaysEngagedUsersCount) {
        userCountArray.push(0);
        continue;
      }

      if (this.selectedPeriodical === 'Daily') {
        userCountArray.push(mod.todaysEngagedUsersCount.active.dailyCount);
      } else if (this.selectedPeriodical === 'Weekly') {
        userCountArray.push(mod.todaysEngagedUsersCount.active.pastWeekCount);
      } else {
        userCountArray.push(mod.todaysEngagedUsersCount.active.pastMonthCount);
      }
    }
    return userCountArray;
  }

  private getInactiveUsers(models: GroupProgressModel[]): number[] {
    const userCountArray = [];

    for (const mod of models) {
      if(!mod.todaysEngagedUsersCount) {
        userCountArray.push(0);
        continue;
      }

      if (this.selectedPeriodical === 'Daily') {
        userCountArray.push(mod.todaysEngagedUsersCount.inactive.dailyCount);
      } else if (this.selectedPeriodical === 'Weekly') {
        userCountArray.push(mod.todaysEngagedUsersCount.inactive.pastWeekCount);
      } else {
        userCountArray.push(mod.todaysEngagedUsersCount.inactive.pastMonthCount);
      }
    }
    return userCountArray;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }

    this._sBs.unsubscribe();
  }

}
