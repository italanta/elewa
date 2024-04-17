import { Component, Input, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable, switchMap } from 'rxjs';

import { GroupProgressModel, Periodicals, UserCount } from '@app/model/analytics/group-based/progress';
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
  @Input() progress$: Observable<{scopedProgress: GroupProgressModel[], allProgress: GroupProgressModel[]}>;
  @Input() period$: Observable<Periodicals>;
  @Input() isLast$: Observable<boolean>;
  
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

  getCompletionRate(courseId: string, progress: GroupProgressModel | null)
  {
    if(!progress || !progress.courseProgress) {
      return 0;
    }

    this.learnersCompletedCourse = progress.courseProgress[courseId].completedLearnerCount as number;
    this.totalLearnersInCourse = (progress.courseProgress[courseId].totalUsers as UserCount).dailyCount;

    return (this.learnersCompletedCourse / this.totalLearnersInCourse) * 100;
  }

  getAverageCompletionTime(courseId: string, progress: GroupProgressModel | null)
  {
    if(!progress || !progress.courseProgress) {
      return "";
    }

    const totalCompletionDuration = progress.courseProgress[courseId].totalCompletionDuration as number;
    const usersCompletedCourse = progress.courseProgress[courseId].completedLearnerCount as number;

    // Calculate average in seconds
    const averageTime = totalCompletionDuration / usersCompletedCourse;

    // Convert to human readable form
    return formatDuration(averageTime);
  }
}
