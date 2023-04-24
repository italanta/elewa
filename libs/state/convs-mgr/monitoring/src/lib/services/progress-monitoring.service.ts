import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProgressMonitoringStore } from '../stores/progress-monitoring.store';

@Injectable({
  providedIn: 'root'
})
export class ProgressMonitoringService {

  constructor(private _progressStore$$: ProgressMonitoringStore) { }

  getMilestones() : Observable<any[]> {
    return this._progressStore$$.get();
  }
}

