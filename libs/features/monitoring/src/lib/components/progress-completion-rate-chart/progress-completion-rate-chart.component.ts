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
import { Classroom, defaultClassroom } from '@app/model/convs-mgr/classroom';
import { GroupProgressModel } from '@app/model/analytics/group-based/progress';

import { periodicals } from '../../models/periodicals.interface';
import {
  getDailyProgress, 
  getWeeklyProgress,
  getMonthlyProgress 
} from '../../providers/helper-fns.util';

@Component({
  selector: 'app-progress-completion-rate-chart',
  templateUrl: './progress-completion-rate-chart.component.html',
  styleUrls: ['./progress-completion-rate-chart.component.scss'],
})
export class ProgressCompletionRateChartComponent {
  chart: Chart<'doughnut'>;

  private _sBs = new SubSink();

  courses: Bot[];
  classrooms: Classroom[];
  botModules: BotModule[];

  activeCourse: Bot;
  activeClassroom: Classroom;
  selectedPeriodical: periodicals;

  showData = false;

  dailyProgress: GroupProgressModel[]; 
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];

  constructor (
    private _progressService: ProgressMonitoringService,
    private _clasroomServ$: ClassroomService,
    private _botModServ$: BotModulesStateService,
    private _botServ$: BotsStateService
  ) {}

  @Input()
  set setPeriodical(value: periodicals) {
    this.selectedPeriodical = value;
    this.selectProgressTracking(value);
  }

  @Input()
  set setActiveCourse(value: Bot) {
    this.activeCourse = value
    this.selectProgressTracking(this.selectedPeriodical);
  }

  @Input()
  set setActiveClassroom(value: Classroom) {
    this.activeClassroom = value
    this.selectProgressTracking(this.selectedPeriodical);
  }

  ngOnInit() {
    this.initDataLayer();

    this._sBs.sink = this._progressService.getMilestones().subscribe((models) => {
      if (models.length) {
        this.showData = true;

        // 1. save all progress
        this.dailyProgress = getDailyProgress(models);
        this.weeklyProgress = getWeeklyProgress(models);
        this.monthlyProgress = getMonthlyProgress(models);
        this.chart = this._loadChart(this.weeklyProgress);
      }
    });
  }

  /** initialise the data layer (fetch bots, modules and classrooms) */
  initDataLayer() {
    this._sBs.sink = this._botServ$.getBots().pipe(
      switchMap(bots => {
        this.courses = bots

        return this._clasroomServ$.getAllClassrooms().pipe(
          switchMap(clsrooms => {
          this.classrooms = clsrooms;
          this.addDefaultClass();
          return this._botModServ$.getBotModules()
        }))
      })
    ).subscribe(botModules => this.botModules = botModules);
  }

  /** add default class */
  addDefaultClass() {
    const classroom = this.classrooms.find(cls => cls.className === defaultClassroom.className)
    classroom ?? this.classrooms.push(defaultClassroom);
  }

  /** select progress tracking periodicals */
  selectProgressTracking(periodical: periodicals) {
    if (!this.dailyProgress) return //return if there's no progress to visualise (avoid chart js errors)

    if (periodical === 'Daily') {
      this.chart = this._loadChart(this.dailyProgress);
    } else if (periodical === 'Weekly') {
      this.chart = this._loadChart(this.weeklyProgress);
    } else {
      this.chart = this._loadChart(this.monthlyProgress);
    }
  }

  private _loadChart(_chartData: any) {
    if (this.chart) {
      this.chart.destroy();
    }

    // don't generate graph if no data is present
    return new Chart('completion-chart', {
      type: 'doughnut',
      data: {
        labels: ['Completion Rate'],
        datasets: [{
          label: 'Completion Rate',
          data: [100],
          backgroundColor: ['rgba(31, 124, 142, 1)'],
          hoverOffset: 4
        }]
      }
    });
  }

  private _drawEmptyChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('completion-chart', {
      type: 'doughnut',
      data: {
        labels: ['No Metrics Available'],
        datasets: [{
          data: [100],
          backgroundColor: ['rgba(128, 128, 128, 1)'],
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
          }
        },
      }
    })
  }

  /** unpack data */
  private getDatasets(model: GroupProgressModel[]) {
    const bot = this.courses.find(course => course.id === this.activeCourse.id) as Bot;

    // if AllCourses is selected we group with the course as our reference point.
    if (!bot) {
      return this.courses.map((bot, idx) => {
        return {
          labels: [bot.name],
          data: this.unpackAllBots(model, bot),
          backgroundColor: ['rgba(31, 124, 142, 1)'],
          hoverOffset: 4
        };
      })
    }

    // if a specific course is selected we group with the modules as our reference point.
    else {
      return bot.modules.map((botMod, idx) => {
        const botModule = this.botModules.find(mod => mod.id === botMod) as BotModule;

        return this.unpackAtModuleLevel(
          model,
          botModule,
          idx,
        )
      });
    }
  }

  unpackAllBots(model:GroupProgressModel[], bot: Bot) {

  }

  unpackAtModuleLevel(model: GroupProgressModel[], botMod: BotModule, idx: number) {

  }
}
