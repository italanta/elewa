import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BreadCrumbPath } from '@app/model/layout/ital-breadcrumb';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbResolver implements Resolve<BreadCrumbPath[]> {
    resolve(route: ActivatedRouteSnapshot): Observable<BreadCrumbPath[]> {
        const assessment = route.data['assessment'];

        const breadcrumbs: BreadCrumbPath[] = [
            { label: 'Assessments', link: '/assessments' },
            { label: assessment.title, link: `/assessments/${assessment.id}` },
            // { label: 'Results' }
        ];

        return of(breadcrumbs);
    }
}
