import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
} from '@angular/router';

import { BehaviorSubject, filter, map, of, switchMap } from 'rxjs';

import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotVersions } from '@app/model/convs-mgr/bots';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<iTalBreadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(
    private router: Router,          
    private _moduleStateServ$: BotModulesStateService,
    private _botStateServ$: BotsStateService,
  ) {
    this.initRouterEvents();
  };

  private initRouterEvents() {
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
  };

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
      };

      // Add another element for the next route part
      this.addBreadcrumb(
        route.firstChild as ActivatedRouteSnapshot,
        routeUrl,
        breadcrumbs
      );
    };
  };

  // set story breadcrumbs
  setStoryBreadcrumbs(story: Story) {
    if (!story.parentModule) return of([])
  
    return this._moduleStateServ$
      .getBotModuleById(story?.parentModule)
      .pipe(
        switchMap((botModule) => {
          return this._botStateServ$.getBotById(botModule?.parentBot as string).pipe(
            switchMap((bot) => {
              const breadcrumbs: iTalBreadcrumb[] = [
                {
                  label: { src: 'assets/svgs/breadcrumbs/bots-stroked.svg' },
                  link: `/bots/dashboard`
                },
                {
                  label: bot?.name ?? "",
                  link: `/bots/${bot?.id}`
                },
                {
                  label: botModule?.name ?? "",
                  link: bot?.type === BotVersions.V1Modular ? `/bots/${bot?.id}/classic/${bot?.id}/modules/${botModule?.id}`
                                                            : `/stories/${botModule?.id}`
                },
                {
                  label: story?.name ?? "",
                  link : `/stories/${story?.id}`
                }
              ]

              return of(breadcrumbs);
            })
          )
        }
      ))
  }

  private getLabel(data: Data) {
    const breadcrumbData = data['breadCrumb'];
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof breadcrumbData === 'function' ? breadcrumbData(data) : breadcrumbData
  };
}
