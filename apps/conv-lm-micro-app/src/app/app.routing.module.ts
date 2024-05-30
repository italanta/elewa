import { NgModule, inject } from '@angular/core';
import { RouterModule, Route, PreloadAllModules }    from '@angular/router';
import { CanAccessMicroAppGuard } from '@app/elements/base/authorisation';
import { MicroAppMainPageComponent } from '@app/features/micro-app';



export const APP_ROUTES: Route[] = [

  { path: '', redirectTo: 'micro-app', pathMatch: "full" },

  {
    path: 'micro-app',
    component: MicroAppMainPageComponent,
    canActivate: [() => inject(CanAccessMicroAppGuard)],
    canLoad: [() => inject(CanAccessMicroAppGuard)]
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
