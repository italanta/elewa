import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, CanActivate, CanLoad } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CLMPermissions } from '@app/model/organisation';

import { UserStore } from '@app/state/user';

import { PermissionsStateService } from '@app/private/state/organisation/main';

@Injectable()
export class CanAccessMicroAppGuard implements CanActivate, CanLoad {
  permissions$: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: UserStore,
    private _permissions$$: PermissionsStateService
  ) {}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.permissions$ = this._permissions$$.checkAccessRight((p: CLMPermissions) => p.MicroAppSettings.CanAccessMicroApp);

    return combineLatest([this.authService.getUser(), this.permissions$])
      .pipe(
        map(([u, p]) => !!u && p),
        tap(canNavigate => {
          if (!canNavigate) {
            this.router.navigate(['/access-denied']);
          }
        })
      );
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getUser().pipe(map(u => !!u));
  }
}
