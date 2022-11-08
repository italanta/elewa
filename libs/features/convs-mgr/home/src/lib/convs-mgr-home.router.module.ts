import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { HomePageComponent } from './pages/home/home.page';

const HOME_ROUTES: Route[] = [
  { path: '', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(HOME_ROUTES)],
  exports: [RouterModule]
})
export class ConvsMgrHomeRouterModule { }
