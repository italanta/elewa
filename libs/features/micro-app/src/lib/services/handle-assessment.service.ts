import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})

/** Service that holds and sets an assessment once it has been fetched in the MicroApp Main Page
 *  Assessment will then be picked up by the content page for rendering
 */
export class MicroAppAssessmentService 
{
  /** An assessment, options for null in cases when an assessment is fetched for the first time */
  private assessmentSubject: BehaviorSubject<Assessment | null> = new BehaviorSubject<Assessment | null>(null);

  setAssessment(assessment: Assessment): void {
    this.assessmentSubject.next(assessment);
  } 

  getAssessment(): Observable<Assessment | null> {
    return this.assessmentSubject.asObservable();
  }
}
