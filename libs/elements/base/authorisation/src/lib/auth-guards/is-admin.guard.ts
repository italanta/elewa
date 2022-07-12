import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UserStore } from '@elewa/state/user';

@Injectable()
export class IsAdminGuard implements CanActivate, CanLoad
{
  constructor(private authService: UserStore, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean
  {
    return this.authService
               .getUser()
               .pipe(map(u => u && u != null && u.roles.admin),
                     tap(canNavigate => {
                        if(!canNavigate)
                          this.router.navigate(['auth/login']);
                     })
                );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean>
  {
    return this.authService
               .getUser()
               .pipe(map(u => u && u != null && u.roles.admin));
  }

}
