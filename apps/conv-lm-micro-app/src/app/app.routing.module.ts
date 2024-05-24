import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules }    from '@angular/router';
import { MicroAppMainPageComponent } from '@app/features/micro-app';


export const APP_ROUTES: Route[] = [

  { path: '', redirectTo: 'micro-app', pathMatch: "full" },

  {
    path: 'micro-app',
    component: MicroAppMainPageComponent,
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
