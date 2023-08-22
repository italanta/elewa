import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CLMPermissions } from '@app/model/organisation';

import { UserStore } from '@app/state/user';

import { PermissionsStateService } from '@app/private/state/organisation/main';


@Injectable()
export class CanAccessAnalyticsGuard implements CanActivate, CanLoad
{

  permission$: Observable<boolean>;

  constructor(private router: Router,
              private authService: UserStore,
              private _permissions$$: PermissionsStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    this.permission$ = this._permissions$$.checkAccessRight((p: CLMPermissions) => p.AnalyticsSettings.CanViewAnalytics);

    return combineLatest([this.authService.getUser(), this.permission$]) 
               .pipe(map(([u, p]) => !!u && p),
                     tap(canNavigate => {
                        if(!canNavigate)
                          this.router.navigate(['/access-denied']);
                     })
                );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean>
  {
    return this.authService
               .getUser()
               .pipe(map(u => !!u));
  }
}
