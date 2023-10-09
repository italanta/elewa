import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { Bot } from '@app/model/convs-mgr/bots';

import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';
import { BotModulesStateService } from '@app/state/convs-mgr/modules'
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { periodicals } from '../../models/periodicals.interface';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { switchMap } from 'rxjs';
import { BotModule } from '@app/model/convs-mgr/bot-modules';

@Component({
  selector: 'app-group-based-progress-chart',
  templateUrl: './group-based-progress-chart.component.html',
  styleUrls: ['./group-based-progress-chart.component.scss'],
})
export class GroupBasedProgressChartComponent implements OnInit, OnDestroy {
  @Input() chart: Chart;

  private _sBs = new SubSink();

  courses: string[] = [];
  classrooms: string[] = [];

  bots: Bot[];
  botModules: BotModule[];
  dataIsFetched = false;

  allProgress: GroupProgressModel[];
  dailyProgress: GroupProgressModel[]; 
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];

  periodical: periodicals = 'Weekly';
  activeCourse = 'All';
  activeClassroom = 'All';

  constructor (
    private _progressService: ProgressMonitoringService,
    private _clasroomServ$: ClassroomService,
    private _botModServ$: BotModulesStateService,
    private _botServ$: BotsStateService
  ) {}

  ngOnInit() {
    this.initStateDataLayer();
    this._sBs.sink = this._progressService.getMilestones().subscribe((models) => {
      console.log(models)

      // 1. save all progress
      this.allProgress = models;

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

  initStateDataLayer() {
    this._sBs.sink = this._botServ$.getBots().pipe(
      switchMap(bots => {
        this.bots = bots
        bots.map(bot => this.courses.push(bot.name))
        this.courses?.unshift('All');
  
        return this._clasroomServ$.getAllClassrooms().pipe(switchMap(clsrooms => {
          clsrooms.map(cl => this.classrooms.push(cl.className))
          this.classrooms?.unshift('All');

          return this._botModServ$.getBotModules()
        }))
      })
    ).subscribe(botModules => this.botModules = botModules);
  }

  selectActiveCourse(course: string) {
    this.activeCourse = course;
    this.selectProgressTracking(this.periodical);
  }

  selectActiveClassroom(classroom: string) {
    this.activeClassroom = classroom;
    this.selectProgressTracking(this.periodical);
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
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('chart-ctx', {
      type: 'bar',
      data: {
        labels: model.map((day) => this.formatDate(day.time)),
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
    const bot = this.bots.find(bot => bot.name === this.activeCourse) as Bot;

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
      backgroundColor: this.getColor(idx),
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

  private formatDate(time: number): string {
    const date = new Date(time * 1000);
    return date.getDate() + '/' + (date.getMonth() + 1);
  }

  private getColor(idx: number) {
    return [ '#e3342f', '#f6993f', '#f66d9b', '#ffed4a', '#4dc0b5', '#3490dc', '#6574cd', '#9561e2', '#38c172' ][idx];
  }  

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }

    this._sBs.unsubscribe();
  }
}
