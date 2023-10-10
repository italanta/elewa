import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';
import { switchMap } from 'rxjs';

import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';
import { BotModulesStateService } from '@app/state/convs-mgr/modules'
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { GroupProgressModel } from '@app/model/analytics/group-based/progress';

import { periodicals } from '../../models/periodicals.interface';
import { formatDate, getColor, getDailyProgress, getWeeklyProgress, getMonthlyProgress } from '../../providers/helper-fns.util';

@Component({
  selector: 'app-group-based-progress-chart',
  templateUrl: './group-based-progress-chart.component.html',
  styleUrls: ['./group-based-progress-chart.component.scss'],
})
export class GroupBasedProgressChartComponent implements OnInit, OnDestroy {
  @Input() chart: Chart;

  private _sBs = new SubSink();

  courses: Bot[] = [];
  classrooms: Classroom[] = [];

  botModules: BotModule[];
  dataIsFetched = false;

  dailyProgress: GroupProgressModel[]; 
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];

  @Input()
  set setPeriodical(value: periodicals) {
    this.selectProgressTracking(value);
  }

  @Input() activeCourse: string;
  @Input() activeClassroom: string;

  constructor (
    private _progressService: ProgressMonitoringService,
    private _clasroomServ$: ClassroomService,
    private _botModServ$: BotModulesStateService,
    private _botServ$: BotsStateService
  ) {}

  ngOnInit() {
    this.initDataLayer();
    this._sBs.sink = this._progressService.getMilestones().subscribe((models) => {
      // 1. save all progress
      this.dailyProgress = getDailyProgress(models);
      this.weeklyProgress = getWeeklyProgress(models);
      this.monthlyProgress = getMonthlyProgress(models);
      this.dataIsFetched = true;

      this.chart = this._loadChart(this.weeklyProgress);
    });
  }

  initDataLayer() {
    this._sBs.sink = this._botServ$.getBots().pipe(
      switchMap(bots => {
        this.courses = bots
        return this._clasroomServ$.getAllClassrooms().pipe(switchMap(clsrooms => {
          this.classrooms = clsrooms
          return this._botModServ$.getBotModules()
        }))
      })
    ).subscribe(botModules => this.botModules = botModules);
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

  private _loadChart(model: GroupProgressModel[]): Chart {
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('chart-ctx', {
      type: 'bar',
      data: {
        labels: model.map((day) => formatDate(day.time)),
        datasets: this.getDatasets(model)
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

  private getDatasets(model: GroupProgressModel[]) {
    const bot = this.courses.find(course => course.name === this.activeCourse) as Bot;

    return bot?.modules.map((botMod, idx) => this.unpackLabel(
      (this.botModules.find(mod => mod.id === botMod) as BotModule)?.name,
      idx, 
      model
    ));
  }

  private unpackLabel(milestone: string, idx: number, model: GroupProgressModel[]) {
    return {
      label: milestone,
      data: this.getData(milestone, model),
      backgroundColor: getColor(idx),
      borderRadius: 10
    };
  }

  private getData(moduleMilestone: string, model: GroupProgressModel[]): number[] {
    if (this.activeCourse === 'All' && this.activeClassroom === 'All') {
      // return moduleMilestone data for all users
      return model.map(
        (item) =>
          item.measurements.find((m) => m.name === moduleMilestone)?.participants
            .length ?? 0
      );
    } else {
      // return moduleMilestone data from users of the active course and class === selected tab
      return model.map(
        (item) =>
          item.groupedMeasurements
          .find((course) => course.name.includes(this.activeCourse))
            ?.classrooms.find((cls) => cls.name.includes(this.activeClassroom))
            ?.measurements?.find((botMod) => botMod.name === moduleMilestone)
            ?.participants.length ?? 0
      );
    }
  }  

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }

    this._sBs.unsubscribe();
  }
}
