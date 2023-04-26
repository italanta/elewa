import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringStore } from '../stores/progress-monitoring.store';

@Injectable({
  providedIn: 'root'
})
export class ProgressMonitoringService {

  constructor(private _progressStore$$: ProgressMonitoringStore) { }

  /**
   * @returns all milestones for all users
   */
  getMilestones() : Observable<GroupProgressModel[]> {
    return this._progressStore$$.get()
  }
}

