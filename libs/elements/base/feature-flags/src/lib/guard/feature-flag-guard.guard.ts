import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagGuardGuard implements CanActivate {
  constructor(private featureFlagService: FeatureFlagService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const featureName = next.data.featureName;
    if (this.featureFlagService.isFeatureOn(featureName)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
 }