import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { PassCriteriaTypes } from '@app/model/convs-mgr/stories/blocks/messaging';

@Injectable({
  providedIn: 'root'
})
export class SetAssessmentScoreService {
  // A Subject to hold the assessment score without an initial value.
  private assessmentScore = new Subject<PassCriteriaTypes>();

  // Observable that can be subscribed to in order to receive updates on the assessment score.
  assessmentScore$ = this.assessmentScore.asObservable();

  constructor() { }

  /**
   * Sets the assessment score and notifies all subscribers.
   * @param assessmentScore The new assessment score to be set.
   */
  setAssessmentScore(assessmentScore: PassCriteriaTypes) {
    this.assessmentScore.next(assessmentScore);
  }

  /**
   * Returns an observable that emits the current assessment score.
   * @returns Observable emitting the assessment score.
   */
  getAssessmentScore(): Observable<PassCriteriaTypes> {
    return this.assessmentScore$;
  }
}
