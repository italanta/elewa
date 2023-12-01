import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FeatureFlagsService } from '../service/feature-flags.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagAuthGuardGuard implements CanActivate {
  constructor(private featureFlagsService: FeatureFlagsService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const featureName = route.data['feature'];
    console.log(`Checking feature flag for ${featureName}: ${this.featureFlagsService.isFeatureOn(featureName)}`);

    if (this.featureFlagsService.isFeatureOn(featureName)) {
      this.router.navigate(['access-denied']);
      return false;
    } else {
      return true;
    }
  }
}