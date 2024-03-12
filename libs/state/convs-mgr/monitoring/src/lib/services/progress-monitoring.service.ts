import { Injectable } from '@angular/core';

import { Observable, map, of } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import {
  CompletionRateProgress,
  GroupProgressModel,
} from '@app/model/analytics/group-based/progress';
import { Bot } from '@app/model/convs-mgr/bots';
import { EndUserService } from '@app/state/convs-mgr/end-users';

import { ProgressMonitoringStore } from '../stores/progress-monitoring.store';
import { ProgressMonitoringState } from '../models/progress-monitoring.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressMonitoringService {


  constructor(private _progressStore$$: ProgressMonitoringStore, private _endUserService: EndUserService) {}

  /**
   * @returns all milestones for all users
   */
  getMilestones(): Observable<GroupProgressModel[]> {
    return this._progressStore$$.get();
  }

  getProgressState() {
    return new ProgressMonitoringState(this._progressStore$$);
  }

  getLatestProgress(): Observable<GroupProgressModel> {
    return this._progressStore$$.get().pipe(map((models)=> {
      return models.reduce((prev, current) => {
        return ((prev.createdOn as Date) > (current.createdOn as Date)) ? prev : current
      });
    }
    ));
  }

  /** returns the latest progress completion data */
  getCompletionRateProgressData(): Observable<CompletionRateProgress> {
    return this._progressStore$$.get().pipe(
      map((models) => {
        const progressData = models[models.length - 1]?.progressCompletion || null;
        return progressData;
      })
    );
  }

  allCoursesTopStats(bots: Bot[], latestProgress: GroupProgressModel) {
    const data = [{count: 0, text: "Courses Published", color: "#05668D", icon: "check-all.svg"},
    {count: 0, text: "Courses Unpublished", color: "#392F5A", icon: "camera-timer.svg"},
    {count: 0, text: "Courses Started", color: "#404E4D", icon: "book-multiple-outline.svg"},
    {count: 0, text: "Courses Completed", color: "#69306D", icon: "book-check-outline.svg"}];

    if(!latestProgress.courseProgress) {
      return data;
    }

    const publishedBots = bots.filter(course => course.isPublished).length;
    const unPublishedBots = bots.length - publishedBots;

    const coursesStarted = latestProgress.coursesStarted.length;
    const coursesCompleted = latestProgress.coursesCompleted.length;

    data[0].count = publishedBots;
    data[1].count = unPublishedBots;
    data[2].count = coursesStarted;
    data[3].count = coursesCompleted;

    // TODO: Move this to component level
    return data;
  }
  
  singleCourseTopStats(courseId: string, latestProgress: GroupProgressModel) {
    // TODO: Move this to component level
    const data = [{count: 0, text: "Engaged Users", color: "#4E4187", icon: "check-all.svg"},
    {count: 0, text: "Active Chats", color: "#EC652A", icon: "camera-timer.svg"},
    {count: 0, text: "Paused Chats", color: "#37505C", icon: "book-multiple-outline.svg"},
    {count: 0, text: "Seeking Assistance", color: "#2B4570", icon: "book-check-outline.svg"}]

    if(!latestProgress.courseProgress) {
      return of(data);
    }

    const usersInCourse = latestProgress.courseProgress[courseId].enrolledUsers as string[];
    
    const engagedUsers = usersInCourse.length;
    
    return this._endUserService.getEndUsersFromEnrolled(usersInCourse).pipe(map((endusers)=> {
      const pausedChats = this._endUserService.getPausedChats(endusers).length;
      const activeChats = this._endUserService.getActiveChats(endusers).length;
      const stuckChats = this._endUserService.getStuckChats(endusers).length;

      data[0].count = engagedUsers;
      data[1].count = activeChats;
      data[2].count = pausedChats;
      data[3].count = stuckChats;
      
     return data;
    }));
  }

  getAnalyticsStartDate() {
    return this._progressStore$$.get().pipe(map((progress: GroupProgressModel[])=> {

      const date = (progress.reduce((prev, current) => {
        return ((prev.createdOn as Date) < (current.createdOn as Date)) ? prev : current
      })).createdOn as Date;

      return __DateFromStorage(date);
    }))
  }
}
