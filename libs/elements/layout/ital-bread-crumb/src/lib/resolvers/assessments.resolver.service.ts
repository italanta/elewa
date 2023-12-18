import { Assessment } from './../../../../../../model/convs-mgr/conversations/assessments/src/lib/assessment.interface';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

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
                const existingAssessments = assessments.find((assessment) => assessment.id === id);
                if (existingAssessments) {
                    return of(existingAssessments);
                } else {
                    return (this._assessmentService.getAssessment$(id) as Observable<Assessment>).pipe(
                        filter((_assessment) => !!assessments),
                        take(1)
                    );
                }
            })
        );
    }
}
