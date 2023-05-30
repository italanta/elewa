import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';

import { periodicals } from '../../models/periodicals.interface';

@Component({
  selector: 'app-group-based-progress-chart',
  templateUrl: './group-based-progress-chart.component.html',
  styleUrls: ['./group-based-progress-chart.component.scss'],
})
export class GroupBasedProgressChartComponent implements OnInit, OnDestroy {
  @Input() chart: Chart;

  private _sBs = new SubSink();

  groups: string[];
  dataIsFetched = false;
  allProgress: GroupProgressModel[];
  dailyProgress: GroupProgressModel[]; 
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];
  periodical: periodicals = 'Weekly';
  activeGroup = 'All';

  constructor (private _progressService: ProgressMonitoringService) {}

  ngOnInit() {
    this._sBs.sink = this._progressService.getMilestones().subscribe((models) => { 

      // 1. save all progress
      this.allProgress = models;

      // 2. get all groups/ classes
      this.groups = this.getGroups(this.allProgress);
      this.groups.unshift('All');

      // 3. get daily progress
      this.getDailyProgress();

      // 4. get weekly progress 
      this.getWeeklyProgress();

      // 5. get Monthly Progress
      this.getMonthlyProgress();

      // 6. show periodical toggle menu after data is fetched
      this.dataIsFetched = true;

      // start the chart with the weekly Progressions
      this.chart = this._loadChart(this.weeklyProgress);
    });
  }

  private getGroups(model: GroupProgressModel[]) {
    // TODO: @LemmyMwaura Pull existing groups from DB after the grouping feature is complete.
    return model[model.length - 1].groupedMeasurements.map((item) => item.name.split('_')[1]);
  }

  selectActiveGroup(group: string) {
    this.activeGroup = group;
    this.selectProgressTracking(this.periodical)
  }

  selectProgressTracking(trackBy: periodicals) {
    this.periodical = trackBy;
  
    if (this.periodical === 'Daily') {
      this.chart = this._loadChart(this.dailyProgress);
    } else if (this.periodical === 'Weekly') {
      this.chart = this._loadChart(this.weeklyProgress);
    } else {
      this.chart = this._loadChart(this.monthlyProgress);
    }
  }

  /** Retrieves daily milestones of all users */
  private getDailyProgress() {
    this.dailyProgress = this.allProgress;
  }

  /** Retrieves weekly milestones of all users */
  private getWeeklyProgress() {
    this.weeklyProgress = this.allProgress.filter(model => {
      const timeInDate = new Date((model.time * 1000))
      const dayOfWeek = timeInDate.getDay();

      if (dayOfWeek === 6) return true
      else return false
    });
  }

  /** Retrieves weekly milestones of all users */
  private getMonthlyProgress() {
    this.monthlyProgress = this.allProgress.filter(model => {
      const timeInDate = new Date((model.time * 1000))
      const dayOfWeek = timeInDate.getDate();

      if (dayOfWeek === 1) return true
      else return false
    });
  }

  private _loadChart(model: GroupProgressModel[]): Chart {
    // TODO: @LemmyMwaura Pull milstones from events after the events brick backend implementation is complete.
    const milestones = ['Pre_Test', 'Onboarding', 'CH1_Systeme', 'CH2_Therapeutic', 'CH3_Indicateurs', 'CH4_Statistics', 'CH5_Maternity', 'Post_Test', 'Complete' ];

    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('chart-ctx', {
      type: 'bar',
      data: {
        labels: model.map((day) => this.formatDate(day.time)),
        datasets: [...milestones].map((milestone, idx) => this.unpackLabel(milestone, idx, model)),
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        normalized: true,
        plugins: {
          title: {
            display: true,
            text: 'Course progression',
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });
  }

  private unpackLabel(milestone: string, idx: number, model: GroupProgressModel[]) {
    return {
      label: milestone,
      data: this.getData(milestone, model),
      backgroundColor: this.getColor(idx),
      borderRadius: 10
    };
  }

  private getData(milestone: string, model: GroupProgressModel[]): number[] {
    if (this.activeGroup === 'All') {
    
      // return milestone data for all users
      return model.map(
        (item) =>
          item.measurements.find((m) => m.name === milestone)?.participants
            .length ?? 0
      );
    } else {

      // return milestone data from users of the active group - selected tab
      return model.map(
        (item) =>
          item.groupedMeasurements
            .find((group) => group.name.includes(this.activeGroup))
            ?.measurements.find((m) => m.name === milestone)?.participants
            .length ?? 0
      );
    }
  }

  private formatDate(time: number): string {
    const date = new Date(time * 1000);
    return date.getDate() + '/' + (date.getMonth() + 1);
  }

  private getColor(idx: number) {
    // TODO: @LemmyMwaura set colors on new events after the events brick backend implementation is complete.
    return [ '#e3342f', '#f6993f', '#f66d9b', '#ffed4a', '#4dc0b5', '#3490dc', '#6574cd', '#9561e2', '#38c172' ][idx];
  }  

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }

    this._sBs.unsubscribe();
  }
}
