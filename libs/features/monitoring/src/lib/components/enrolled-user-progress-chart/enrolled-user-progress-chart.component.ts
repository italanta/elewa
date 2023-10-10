import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';

import { periodicals } from '../../models/periodicals.interface';
import { formatDate, getColor, getDailyProgress, getMonthlyProgress, getWeeklyProgress } from '../../providers/helper-fns.util';

@Component({
  selector: 'app-enrolled-user-progress-chart',
  templateUrl: './enrolled-user-progress-chart.component.html',
  styleUrls: ['./enrolled-user-progress-chart.component.scss'],
})
export class EnrolledUserProgressChartComponent implements OnInit, OnDestroy {
  chart: Chart;

  allProgress: GroupProgressModel[];
  dailyProgress: GroupProgressModel[]; 
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];
  
  @Input()
  set setPeriodical(value: periodicals) {
    this.selectProgressTracking(value);
  }

  @Input() activeCourse: string;
  @Input() activeClassroom: string;

  constructor(private _progressService: ProgressMonitoringService){}

  ngOnInit(): void {
    this.getProgressData();
  }

  getProgressData() {
    this._progressService.getMilestones().subscribe(model => {
      this.chart = this._loadChart(model);
      this.dailyProgress = getDailyProgress(model);
      this.weeklyProgress = getWeeklyProgress(model);
      this.monthlyProgress = getMonthlyProgress(model);

      this.chart = this._loadChart(this.weeklyProgress);
    })
  }

  selectProgressTracking(periodical: periodicals) {
    if (this.dailyProgress === null) return

    if (periodical === 'Daily') {
      this.chart = this._loadChart(this.dailyProgress);
    } else if (periodical === 'Weekly') {
      this.chart = this._loadChart(this.weeklyProgress);
    } else {
      this.chart = this._loadChart(this.monthlyProgress);
    }
  }

  private _loadChart(model: GroupProgressModel[]){
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('user-chart', {
      type: 'bar',
      data: {
        labels: [10, 20, 30, 40, 50, 85],
        datasets:  [{
          label: `Enrolled User's`,
          // data: models.map(mod => mod.todaysEnrolledUsersCount),
          data: [10, 20, 30, 40, 50, 85],
          backgroundColor: getColor(1),
          borderRadius: 10
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        normalized: true,
        plugins: {
          title: {
            display: true,
            text: 'Course enrollment',
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    })
  }

  private unpackLabel(idx:number, models: GroupProgressModel[]) {
    return {
      label: `Enrolled User's`,
      data: models.map(mod => mod.todaysEnrolledUsersCount),
      backgroundColor: getColor(idx),
      borderRadius: 10
    };
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
