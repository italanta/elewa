import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormViewMode, AssessmentPageViewMode } from '../model/view-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class AppViewService 
{
  /** Single question form or multiple question forms */
  private formViewModeSource = new BehaviorSubject<FormViewMode >(FormViewMode .MultipleQuestionView);
  /** Different page view navigation */
  private pageViewModeSource = new BehaviorSubject<AssessmentPageViewMode>(AssessmentPageViewMode.AssessmentMode)

  formViewMode$ = this.formViewModeSource.asObservable();
  pageViewMode$ = this.pageViewModeSource.asObservable()

  constructor() { }

  /** Getting and setting the type of form to display */
  setFormViewMode(viewMode: FormViewMode) {
    this.formViewModeSource.next(viewMode);
  }

  getFormViewMode(): Observable<FormViewMode> {
    return this.formViewMode$;
  }

  /** Getting and setting the page to show */
  setPageViewMode(viewMode: AssessmentPageViewMode) {
    this.pageViewModeSource.next(viewMode);
  }

  getPageViewMode(): Observable<AssessmentPageViewMode> {
    return this.pageViewMode$;
  }
}
