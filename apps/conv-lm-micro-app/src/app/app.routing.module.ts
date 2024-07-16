import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules }    from '@angular/router';
import { ContentSectionComponent } from '@app/features/convs-mgr/conversations/assessments';

import { MicroAppContentPageComponent, MicroAppStartPageComponent, PlatformRedirectPageComponent } from '@app/features/micro-app';




export const APP_ROUTES: Route[] = [

  { path: ':id', redirectTo: 'start', pathMatch: "full" },

  {
    path: 'start/:id',
    component: MicroAppStartPageComponent,
    // canActivate: [() => inject(CanAccessMicroAppGuard)],
    // canLoad: [() => inject(CanAccessMicroAppGuard)]
  },
  {
    path: 'main/:id',
    component: ContentSectionComponent,
    // canActivate: [() => inject(CanAccessMicroAppGuard)],
    // canLoad: [() => inject(CanAccessMicroAppGuard)]
  },
  {
    path: 'redirect/:id',
    component: PlatformRedirectPageComponent,
    // canActivate: [() => inject(CanAccessMicroAppGuard)],
    // canLoad: [() => inject(CanAccessMicroAppGuard)]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      APP_ROUTES,
      {
        enableTracing: true,
        // useHash: true,
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
