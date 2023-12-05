import { Component, Input } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';

import { BotModulesStateService } from '@app/state/convs-mgr/modules'
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { CompletionRateProgress } from '@app/model/analytics/group-based/progress';

import { switchMap } from 'rxjs';

@Component({
  selector: 'app-progress-completion-rate-chart',
  templateUrl: './progress-completion-rate-chart.component.html',
  styleUrls: ['./progress-completion-rate-chart.component.scss'],
})
export class ProgressCompletionRateChartComponent {
  chart: Chart<'doughnut'>;

  private _sBs = new SubSink();

  courses: Bot[];
  activeCourse: Bot;
  allBotModules: BotModule[];
  modulesInActiveCourse: BotModule[];
  selectedModule: BotModule;

  completionRateData: CompletionRateProgress;

  showData = false;

  constructor (
    private _progressService: ProgressMonitoringService,
    private _clasroomServ$: ClassroomService,
    private _botModServ$: BotModulesStateService,
    private _botServ$: BotsStateService
  ) {}

  @Input()
  set setActiveCourse(value: Bot) {
    this.activeCourse = value;
    this.selectActiveCourse(this.activeCourse);
  }

  ngOnInit() {
    this.initDataLayer();

    this._sBs.sink = this._progressService.getCompletionRateProgressData().subscribe((data) => {
      if (data) {
        this.showData = true;
        this.completionRateData = data;
        this.chart = this._loadChart(this.completionRateData);
      }
    });
  }

  /** initialise the data layer (fetch bots, modules and classrooms) */
  initDataLayer() {
    this._sBs.sink = this._botServ$.getBots().pipe(
      switchMap(bots => {
        this.courses = bots
        return this._botModServ$.getBotModules()
      })
    ).subscribe(allBotModules => this.allBotModules = allBotModules);
  }

  /** select progress tracking periodicals */
  selectActiveCourse(course: Bot) {
    if (!this.completionRateData) return;

    if (this.activeCourse.name === 'All') {
      this.modulesInActiveCourse = [];
    } else {
      this.modulesInActiveCourse = this.allBotModules.filter((botMod) => botMod.parentBot === course.id);
    }
  }

  private _loadChart(_chartData: CompletionRateProgress) {
    if (this.chart) {
      this.chart.destroy();
    }

    // don't generate graph if no data is present
    return new Chart('completion-chart', {
      type: 'doughnut',
      data: {
        labels: ['Completion Rate'],
        datasets: [this.getChartData(_chartData)]
      }
    });
  }


  getChartData(chartData: CompletionRateProgress) {
    if (this.activeCourse.name === 'All') {
      return {
        label: 'All Courses',
        data: [chartData.allCourseAverage],
        backgroundColor: ['rgba(31, 124, 142, 1)'],
        hoverOffset: 4
      }
    }

    const averageProgress =
      chartData.progressData[this.activeCourse.id as string]?.modules[
        this.selectedModule.id as string
      ]?.avgModuleProgress;
      
    return {
      label: this.selectedModule.name,
      data: [averageProgress],
      backgroundColor: ['rgba(31, 124, 142, 1)'],
      hoverOffset: 4
    }
  }
}
