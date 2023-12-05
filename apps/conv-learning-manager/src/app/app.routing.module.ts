import { NgModule } from '@angular/core';
import { RouterModule, Route, PreloadAllModules }    from '@angular/router';

import { CanAccessAnalyticsGuard, CanAccessAssessmentsGuard, CanAccessBotsGuard, 
         CanAccessChatsGuard, CanAccessLearnersGuard, IsLoggedInGuard, 
         CanAccessFFlagGuard 
} from '@app/elements/base/authorisation';

import { NoPermissionToAccessComponent } from '@app/private/elements/convs-mgr/access-control';

export const APP_ROUTES: Route[] = [

  // App Entry-Point - For now, we mock the normally to include paths such as org and flow selection and go
  //    straight too the default active flow.
  { path: '', redirectTo: `home`, pathMatch: 'full' },

  //
  // AUTH

  {
    path: 'auth',
    loadChildren: () => import('@app/features/app/auth/login').then(m => m.AuthModule),
  },

  {
    path: 'orgs',
    loadChildren: () => import('@app/private/features/convs-mgr/orgs').then(m => m.OrganisationModule),
    data: { title: 'Organisation' }
  },

  {
    path: 'home',
    loadChildren: () => import('@app/features/convs-mgr/home').then(m => m.ConvsMgrHomeModule),
    canActivate: [IsLoggedInGuard]
  },

  {
    path: 'bots',
    loadChildren: () => import('@app/features/convs-mgr/stories/home').then(m => m.ConvsMgrStoriesHomeModule),
    canActivate: [IsLoggedInGuard, CanAccessBotsGuard]
  },

  {
    path: 'modules',
    loadChildren: () => import('@app/features/convs-mgr/modules').then(m => m.ConvsMgrModulesModule),
    canActivate: [IsLoggedInGuard, CanAccessBotsGuard]
  },

  {
    path: 'stories',
    loadChildren: () => import('@app/features/convs-mgr/lessons').then(m => m.ConvsMgrLessonsModule),
    canActivate: [IsLoggedInGuard, CanAccessBotsGuard]
  },

  {
    path: 'analytics',
    loadChildren: () => import('@app/private/features/convs-mgr/analytics').then(m => m.AnalyticsModule),
    canActivate: [IsLoggedInGuard, CanAccessAnalyticsGuard , CanAccessFFlagGuard],
    data: { feature: 'analytics' }
  },

  {
    path: 'learners',
    loadChildren: () => import('@app/features/convs-mgr/learners').then(m => m.ConvsMgrLearnersModule),
    canActivate: [IsLoggedInGuard, CanAccessLearnersGuard]
  },

  {
    path: 'chats',
    loadChildren: () => import('@app/features/convs-mgr/conversations/chats').then(m => m.ConvsMgrConversationsChatsModule),
    canActivate: [IsLoggedInGuard, CanAccessChatsGuard]
  },

  {
    path: 'messaging',
    loadChildren: () => import('@app/private/features/convs-mgr/message-templates').then(m => m.ConvsMgrMessageTemplatesModule),
    canActivate: [IsLoggedInGuard, CanAccessChatsGuard]
  },

  {
    path: 'assessments',
    loadChildren: () => import('@app/features/convs-mgr/conversations/assessments').then(m => m.ConvsMgrAssessmentsModule),
    canActivate: [IsLoggedInGuard, CanAccessAssessmentsGuard]
  },
  
  {
    path: 'surveys',
    loadChildren: () => import('@app/features/convs-mgr/conversations/surveys').then(m => m.ConvsMgrSurveysModule),
    canActivate: [IsLoggedInGuard , CanAccessFFlagGuard],
    data: { feature: 'surveys' }
  },

  {
    path: 'settings',
    loadChildren: () => import('@app/private/features/convs-mgr/settings/main').then(m => m.SettingsModule),
    canActivate: [IsLoggedInGuard]
  },

  {
    path: 'access-denied',
    component: NoPermissionToAccessComponent,
    data: { title: 'Access Denied' },
    canActivate: [IsLoggedInGuard]
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
