import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewMode } from '../models/view-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class QuestionsViewService {
  private viewModeSource = new BehaviorSubject<ViewMode>(ViewMode.MultipleQuestionView);
  viewMode$ = this.viewModeSource.asObservable();

  constructor() { }

  setViewMode(viewMode: ViewMode) {
    this.viewModeSource.next(viewMode);
  }

  getViewMode(): Observable<ViewMode> {
    return this.viewMode$;
  }
}
