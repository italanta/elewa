import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';

import { periodicals } from '../../models/periodicals.interface';
import {
  formatDate,
  getColor,
  getDailyProgress,
  getMonthlyProgress,
  getWeeklyProgress,
} from '../../providers/helper-fns.util';

@Component({
  selector: 'app-enrolled-user-progress-chart',
  templateUrl: './enrolled-user-progress-chart.component.html',
  styleUrls: ['./enrolled-user-progress-chart.component.scss'],
})
export class EnrolledUserProgressChartComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();
  
  chart: Chart;

  activeCourse: string;
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

    return new Chart('user-chart', {
      type: 'bar',
      data: {
        labels: models.map((day) => formatDate(day.time)),
        datasets: [
          {
            label: `Enrolled User's`,
            data: this.getData(models),
            backgroundColor: getColor(1),
            borderRadius: 10,
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
            text: 'Course enrollment',
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });
  }

  private getData(models: GroupProgressModel[]): number[] {
    if (this.selectedPeriodical === 'Daily') {
      return models.map((mod) => mod.todaysEnrolledUsersCount.dailyCount);
    } else if (this.selectedPeriodical === 'Weekly') {
      return models.map((mod) => mod.todaysEnrolledUsersCount.pastWeekCount);
    } else {
      return models.map((mod) => mod.todaysEnrolledUsersCount.pastMonthCount);
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }

    this._sBs.unsubscribe();
  }
}
