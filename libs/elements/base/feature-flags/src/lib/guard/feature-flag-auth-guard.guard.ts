import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';

import { FeatureFlagsService } from '../service/feature-flags.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagAuthGuardGuard implements CanActivate {
  constructor(private featureFlagsService: FeatureFlagsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const featureName = route.data['feature'];

    if (this.featureFlagsService.isFeatureOn(featureName)) {
      this.router.navigate(['access-denied']);
      return false;
    } else {
      return true;
    }
  }
}