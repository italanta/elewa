import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';

import { map, tap } from 'rxjs/operators';

import { FeatureFlagsService } from '@app/elements/base/feature-flags';
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagGuard implements CanActivate {
  constructor(private featureFlagsService: FeatureFlagsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const featureName = route.data['feature'];

    this.featureFlagsService.loadFeatureFlags().pipe(
      map((data) => data[featureName]),
      tap((isFeatureEnabled) => {
        if (isFeatureEnabled) {
          this.router.navigate(['/access-denied']);
        }
      })
    ).subscribe();
    return true;
  }
  
}
