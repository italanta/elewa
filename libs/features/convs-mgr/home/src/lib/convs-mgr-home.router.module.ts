import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { HomePageComponent } from './pages/home/home.page';

const ORG_ROUTES: Route[] = [
  { path: '', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
  { path: 'bots', component: HomePageComponent, canActivate: [IsLoggedInGuard] },

  { path: 'bots', children: [
    { path: 'org/:id/flows/:id/chats', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
    { path: 'org/:id/flows/:id/chats', children : [
      { path: 'participants', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
    ]},
    { path: 'sales', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
    { path: 'statistics', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
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
