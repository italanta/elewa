import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart, TooltipItem } from 'chart.js/auto';
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
  formatDate, 
  getColor, 
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
  @Input() chart: Chart;

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

  private _loadChart(chartData: GroupProgressModel[]) {
    // don't generate graph if no data is present
    return new Chart('chart-ctx', {
      type: 'pie',
      data: {
        labels: ['completion-rate'],
        datasets: [{
          data: chartData,
          backgroundColor: ['rgb(2, 179, 254)'],
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
              label(context:TooltipItem<"pie">) {
                const sum = context.dataset.data.reduce((sum, value) => sum + value);
      
                const value = context.raw as number;
                const percentage = Math.round((value / sum) * 100);
      
                return `learners ${value} (${percentage}%)`;
              }
            }
          }
        },
      }
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
              label(context:TooltipItem<"pie">) {
                const sum = context.dataset.data.reduce((sum, value) => sum + value);
      
                const value = context.raw as number;
                const percentage = Math.round((value / sum) * 100);
      
                return `learners ${value} (${percentage}%)`;
              }
            }
          }
        },
      }
    })
  }

  unpackData(data: GroupProgressModel[]) {
    data.map((item) => item.measurements)
  }
}
