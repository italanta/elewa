import { Component, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';
import { switchMap } from 'rxjs';

import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';
import { BotModulesStateService } from '@app/state/convs-mgr/modules'
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { CompletionRateProgress } from '@app/model/analytics/group-based/progress';


@Component({
  selector: 'app-progress-completion-rate-chart',
  templateUrl: './progress-completion-rate-chart.component.html',
  styleUrls: ['./progress-completion-rate-chart.component.scss'],
})
export class ProgressCompletionRateChartComponent implements OnDestroy {
  chart: Chart<'doughnut'>;

  private _sBs = new SubSink();

  courses: Bot[];
  activeCourse: Bot;

  allBotModules: BotModule[];
  modulesInActiveCourse: BotModule[];
  selectedModule: BotModule;

  showData = false;
  completionRateData: CompletionRateProgress;

  constructor (
    private _progressService: ProgressMonitoringService,
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

  /** initialise the data layer (fetch bots, modules) */
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
    this.modulesInActiveCourse = this.allBotModules.filter((botMod) => botMod.parentBot === course.id);
    this.selectedModule = this.modulesInActiveCourse[0];

    this.updateChart();
  }

  // called when a module is selected
  onSelectChange() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.updateChart();
  }

  private updateChart() {
    if (this.chart) this.chart.destroy();
    
    if (this.showData) {
      this.chart = this._loadChart(this.completionRateData);
    }
  }

  private _loadChart(_chartData: CompletionRateProgress) {
    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('completion-chart', {
      type: 'doughnut',
      data: {
        labels: ['Completion Rate'],
        datasets: [this._getChartData(_chartData)]
      }
    });
  }

  private _getChartData(chartData: CompletionRateProgress) {
    // if all course is selected we return avgProgress for allcourses;
    if (this.activeCourse.name === 'All') {
      return {
        label: 'All Courses',
        data: [chartData.allCourseAverage],
        backgroundColor: ['rgba(31, 124, 142, 1)'],
        hoverOffset: 4
      }
    }

    // if a course is selected but no module in the course is selcted we return the avg progress for the entire course;
    if (!this.selectedModule) {
      return {
        label: this.activeCourse.name,
        data: [chartData.progressData.find((course) => course.courseId)?.avgCourseProgress ?? 0],
        backgroundColor: ['rgba(31, 124, 142, 1)'],
        hoverOffset: 4
      }
    } 
    
    // if a course is selected and a course is selected we return the avg progress for the module;
    else {
      const avgProg = chartData.progressData.find((course) => course.courseId)?.modules.find(
        (mod) => mod.moduleId === this.selectedModule.id
      )?.avgModuleProgress ?? 0;

      return {
        label: this.selectedModule.name,
        data: [avgProg],
        backgroundColor: ['rgba(31, 124, 142, 1)'],
        hoverOffset: 4
      }
    }
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
