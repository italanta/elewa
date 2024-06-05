import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetAssessmentScoreService {
  // A Subject to hold the assessment score without an initial value.
  private assessmentScore = new Subject<any>();

  // Observable that can be subscribed to in order to receive updates on the assessment score.
  assessmentScore$ = this.assessmentScore.asObservable();

  constructor() { }

  /**
   * Sets the assessment score and notifies all subscribers.
   * @param assessmentScore The new assessment score to be set.
   */
  setAssessmentScore(assessmentScore: any) {
    this.assessmentScore.next(assessmentScore);
  }

  /**
   * Returns an observable that emits the current assessment score.
   * @returns Observable emitting the assessment score.
   */
  getAssessmentScore(): Observable<any> {
    return this.assessmentScore$;
  }
}
