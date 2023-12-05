import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';

import { map, tap } from 'rxjs/operators';

import { FeatureFlagsService } from '@app/elements/base/feature-flags';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CanAccessFFlagGuard implements CanActivate {
  constructor(private featureFlagsService: FeatureFlagsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) : Observable<boolean> {
    const featureName = route.data['feature'];

    return this.featureFlagsService.loadFeatureFlags().pipe(
      map((data) => data[featureName]),
      tap((isFeatureEnabled) => {
        if (!isFeatureEnabled) this.router.navigate(['/access-denied']);
      })
    )
  }
  
}
