import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root',
})
export class AssessmentResolverService implements Resolve<Assessment> {
  private fetchedAssessments$: Observable<Assessment[]>;

  constructor(private _assessmentService: AssessmentService) {
    this.fetchedAssessments$ = this._assessmentService.getAssessments$().pipe(take(1));
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Assessment> {
    const id = route.params['id'];

    return this.fetchedAssessments$.pipe(
      switchMap((assessments) => {
        const existingAssessment = assessments.find((assessment) => assessment.id === id);

        if (existingAssessment) {
          return of(existingAssessment);
        } else {
          return (this._assessmentService.getAssessment$(id) as Observable<Assessment>).pipe(
            filter((assessment) => !!assessment),
            take(1)
          );
        }
      })
    );
  }
}
