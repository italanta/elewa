import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { SubSink } from 'subsink';

import { __DateFromStorage } from '@iote/time';

import { GroupProgressModel, Periodicals } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';
import { Bot } from '@app/model/convs-mgr/bots';

import { getAllDaysCountCourse, getDailyProgress, getLabels, getMonthlyProgress, getUsersCurrentMonth, getUsersCurrentWeek, getWeeklyProgress } from '../../providers/helper-fns.util';

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
  selectedPeriodical: Periodicals;

  showData = false;

  allProgress: GroupProgressModel[];
  dailyProgress: GroupProgressModel[];
  weeklyProgress: GroupProgressModel[];
  monthlyProgress: GroupProgressModel[];

  allDaysCount: { activeUsers: any, inactiveUsers: any };

  currentWeekCount = { activeUsers: 0, inactiveUsers: 0 };

  currentMonthCount = { activeUsers: 0, inactiveUsers: 0 };

  @Input()
  set setPeriodical(value: Periodicals) {
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

        const courseId = this.activeCourse ? this.activeCourse.id as string : 'all';

        this.allDaysCount = {
          activeUsers: getAllDaysCountCourse(this.dailyProgress, 'activeUsers', courseId),
          inactiveUsers: getAllDaysCountCourse(this.dailyProgress, 'inactiveUsers', courseId)
        }
  
        this.currentWeekCount = {
          activeUsers: getUsersCurrentWeek(this.allDaysCount.activeUsers),
          inactiveUsers: getUsersCurrentWeek(this.allDaysCount.inactiveUsers)
        }

        this.currentMonthCount = {
          activeUsers: getUsersCurrentMonth(this.allDaysCount.activeUsers),
          inactiveUsers: getUsersCurrentMonth(this.allDaysCount.inactiveUsers)
        }

        this.chart = this._loadChart(this.weeklyProgress);
      }
    });
  }

  selectProgressTracking(periodical: Periodicals) {
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
    let activeUsers: number[];
    let inActiveUsers: number[];

    if(this.activeCourse) {
      const courseId = this.activeCourse.id as string;
      activeUsers = this.getUserEngagement(models, 'activeUsers', courseId);
      inActiveUsers = this.getUserEngagement(models, 'inactiveUsers', courseId);
    } else {
      activeUsers = this.getUserEngagement(models, 'activeUsers', 'all');
      inActiveUsers = this.getUserEngagement(models, 'inactiveUsers', 'all');
    }

    if (this.chart) {
      this.chart.destroy();
    }

    return new Chart('user-engagement-chart', {
      type: 'line',
      data: {
        labels: getLabels(models, this.selectedPeriodical),
        datasets: [
          {
            /** Line styling */
            label: `Active users`,
            data: activeUsers,
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
            label: `Inactive users`,
            data: inActiveUsers,
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
              maxTicksLimit: 12,
              autoSkip: false
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

  private getUserEngagement(models: GroupProgressModel[], usersType: string, courseId: string): number[] {

    const userCountArray = [] as number[];

    for (const mod of models) {
      if(!mod.courseProgress) {
        userCountArray.push(0);
        continue;
      }

      if (this.selectedPeriodical === 'Daily') {
        userCountArray.push(mod.courseProgress[courseId][usersType].dailyCount);
      } else if (this.selectedPeriodical === 'Weekly') {
        userCountArray.push(mod.courseProgress[courseId][usersType].pastWeekCount);
        userCountArray.push(this.currentWeekCount[usersType]);
      } else {
        userCountArray.push(mod.courseProgress[courseId][usersType].pastMonthCount);
        userCountArray.push(this.currentMonthCount[usersType]);
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
