import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  CompletionRateProgress,
  GroupProgressModel,
} from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringStore } from '../stores/progress-monitoring.store';

@Injectable({
  providedIn: 'root',
})
export class ProgressMonitoringService {
  constructor(private _progressStore$$: ProgressMonitoringStore) {}

  /**
   * @returns all milestones for all users
   */
  getMilestones(): Observable<GroupProgressModel[]> {
    return this._progressStore$$.get();
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
}
