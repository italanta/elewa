import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { HomePageComponent } from './pages/home/home.page';

const ORG_ROUTES: Route[] = [
  { path: '', component: HomePageComponent, canActivate: [IsLoggedInGuard] },
  {
    path: 'sales',
    component: HomePageComponent,
    children: [
      {
        path: 'purchases',
        component: HomePageComponent,
        canActivate: [IsLoggedInGuard],
      },
    ],
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'statistics',
    component: HomePageComponent,
    children: [
      {
        path: 'trainee data',
        component: HomePageComponent,
        canActivate: [IsLoggedInGuard],
      },
      {
        path: 'progress-analysis',
        component: HomePageComponent,
        canActivate: [IsLoggedInGuard],
      },
    ],
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'chats',
    component: HomePageComponent,
    children: [
      {
        path: 'conversations',
        component: HomePageComponent,
        canActivate: [IsLoggedInGuard],
      },
      {
        path: 'assessment',
        component: HomePageComponent,
        canActivate: [IsLoggedInGuard],
      },
      {
        path: 'participants',
        component: HomePageComponent,
        canActivate: [IsLoggedInGuard],
      },
    ],
    canActivate: [IsLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ORG_ROUTES)],
  exports: [RouterModule]
})
export class ConvsMgrHomeRouterModule { }
