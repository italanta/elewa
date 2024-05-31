import { NgModule, inject } from '@angular/core';
import { RouterModule, Route, PreloadAllModules }    from '@angular/router';
import { CanAccessMicroAppGuard } from '@app/elements/base/authorisation';

import { MicroAppContentPageComponent, MicroAppMainPageComponent, PlatformRedirectPageComponent } from '@app/features/micro-app';




export const APP_ROUTES: Route[] = [

  { path: '', redirectTo: 'start', pathMatch: "full" },

  {
    path: 'start',
    component: MicroAppMainPageComponent,
    // canActivate: [() => inject(CanAccessMicroAppGuard)],
    // canLoad: [() => inject(CanAccessMicroAppGuard)]
  },
  {
    path: 'main',
    component: MicroAppContentPageComponent,
    // canActivate: [() => inject(CanAccessMicroAppGuard)],
    // canLoad: [() => inject(CanAccessMicroAppGuard)]
  },
  {
    path: 'redirect',
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
