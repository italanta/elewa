import { Component, Input, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { switchMap } from 'rxjs';

import { GroupProgressModel, Periodicals } from '@app/model/analytics/group-based/progress';
import { Bot } from '@app/model/convs-mgr/bots';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';

import { formatDuration } from '../../utils/format-duration.util';

@Component({
  selector: 'app-single-course-page',
  templateUrl: './single-course-page.component.html',
  styleUrls: ['./single-course-page.component.scss'],
})
export class SingleCoursePageComponent implements OnInit
{
  @Input() periodical: Periodicals;
  @Input() activeCourse: Bot;
  @Input() activeClassroom: Classroom;

  _sBs = new SubSink();

  topStatsSingleCourse: any[];
  completionRate: number;
  averageCompletionTime: string;
  learnersCompletedCourse = 0;
  totalLearnersInCourse = 0;  

  constructor(private _progressMonitoring: ProgressMonitoringService) { }

  ngOnInit(): void
  {
    const progress$ = this._progressMonitoring.getLatestProgress();
    const courseId = this.activeCourse.id as string;

    this._sBs.sink = progress$.pipe(switchMap((progress) => {
      this.completionRate = this.getCompletionRate(courseId, progress);
      this.averageCompletionTime = this.getAverageCompletionTime(courseId, progress);

      return this._progressMonitoring.singleCourseTopStats(courseId, progress)
    }))
      .subscribe((stats) => this.topStatsSingleCourse = stats);
  }

  getCompletionRate(courseId: string, progress: GroupProgressModel)
  {
    if(!progress.courseProgress) {
      return 0;
    }
    this.learnersCompletedCourse = progress.courseProgress[courseId].completedLearnerCount;
    this.totalLearnersInCourse = progress.courseProgress[courseId].totalUsers.dailyCount;

    return (this.learnersCompletedCourse / this.totalLearnersInCourse) * 100;
  }

  getAverageCompletionTime(courseId: string, progress: GroupProgressModel)
  {
    if(!progress.courseProgress) {
      return "";
    }
    const totalCompletionDuration = progress.courseProgress[courseId].totalCompletionDuration;
    const usersCompletedCourse = progress.courseProgress[courseId].completedLearnerCount;

    // Calculate average in seconds
    const averageTime = totalCompletionDuration / usersCompletedCourse;

    // Convert to human readable form
    return formatDuration(averageTime);
  }
}
