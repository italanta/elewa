import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, filter, map } from 'rxjs';

import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<iTalBreadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.initRouterEvents();
  }

  private initRouterEvents() 
  {
    this.router.events.pipe(
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        // Construct the breadcrumb hierarchy
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: iTalBreadcrumb[] = [];
        this.addBreadcrumb(root, [], breadcrumbs);

        // Emit the new hierarchy
        this._breadcrumbs$.next(breadcrumbs);
      })
    )
    .subscribe();
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: iTalBreadcrumb[]) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      // Check if the route path ends with "/modules" and remove the last element if true.
      const isModulesRoute = route.routeConfig?.path?.endsWith('/modules');
      if (isModulesRoute) {
        routeUrl.pop();
      }

      // Add an element for the current route part
      if (route.data['breadCrumb']) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          link: '/' + routeUrl.join('/'),
        };

        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.addBreadcrumb(
        route.firstChild as ActivatedRouteSnapshot,
        routeUrl,
        breadcrumbs
      );
    }
  }

  private getLabel(data: Data) 
  {
    const breadcrumbData = data['breadCrumb'];
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof breadcrumbData === 'function' ? breadcrumbData(data) : breadcrumbData
  }
}
