import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormViewMode, PageViewMode } from '../model/view-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class AppViewService {
  private formViewModeSource = new BehaviorSubject<FormViewMode >(FormViewMode .MultipleQuestionView);
  private pageViewModeSource = new BehaviorSubject<PageViewMode>(PageViewMode.HomePageView)

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
  setPageViewMode(viewMode: PageViewMode) {
    this.pageViewModeSource.next(viewMode);
  }

  getPageViewMode(): Observable<PageViewMode> {
    return this.pageViewMode$;
  }
}
