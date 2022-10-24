import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { HomePageComponent } from './pages/home/home.page';
// import { ConvlPageModule } from '@app/elements/layout/page-convl';

const ORG_ROUTES: Route[] = [
  { path: '', component: HomePageComponent, canActivate: [IsLoggedInGuard] },

  // to be changed - mock  routes
  { path: '', children: [
    // chats
    { path: 'org/:id/flows/:id/chats', component: HomePageComponent, children : [
      { path: '', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
      { path: 'participants', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
      { path: 'assessments', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
    ], canActivate: [IsLoggedInGuard] },

    // sales
    { path: 'sales', component: HomePageComponent, canActivate: [IsLoggedInGuard] },

    // statistics
    { path: 'statistics', component: HomePageComponent, children: [
      { path: '', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
      { path: 'progress-analysis', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
    ], canActivate: [IsLoggedInGuard] },
  ]},

  // {
  //   path: ':id/finance',
  //   loadChildren: () => import('libs/features/portal/finance/home/src/lib/finance-home.module').then(m => m.FinanceHomeModule),
  //   canActivate: [IsLoggedInGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(ORG_ROUTES)],
  exports: [RouterModule]
})
export class ConvsMgrHomeRouterModule { }
