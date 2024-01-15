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
    data: { breadCrumb: 'Auth' }
  },

  {
    path: 'orgs',
    loadChildren: () => import('@app/private/features/convs-mgr/orgs').then(m => m.OrganisationModule),
    data: { title: 'Organisation', breadCrumb: 'Orgs' }
  },

  {
    path: 'home',
    loadChildren: () => import('@app/features/convs-mgr/home').then(m => m.ConvsMgrHomeModule),
    data: { breadCrumb: 'Home' },
    canActivate: [IsLoggedInGuard],
  },

  {
    path: 'bots',
    loadChildren: () => import('@app/features/convs-mgr/stories/home').then(m => m.ConvsMgrStoriesHomeModule),
    data: {
      breadCrumb: { src: 'assets/svgs/breadcrumbs/bots-stroked.svg' },
    },
    canActivate: [IsLoggedInGuard, CanAccessBotsGuard]
  },

  {
    path: 'stories',
    loadChildren: () => import('@app/features/convs-mgr/lessons').then(m => m.ConvsMgrLessonsModule),
    data: { breadCrumb: 'Lessons' },
    canActivate: [IsLoggedInGuard, CanAccessBotsGuard],
  },

  {
    path: 'analytics',
    loadChildren: () => import('@app/private/features/convs-mgr/analytics').then(m => m.AnalyticsModule),
    data: { feature: 'analytics', breadCrumb: 'Analytics' },
    canActivate: [IsLoggedInGuard, CanAccessAnalyticsGuard , CanAccessFFlagGuard],
  },

  {
    path: 'learners',
    loadChildren: () => import('@app/features/convs-mgr/learners').then(m => m.ConvsMgrLearnersModule),
    data: { breadCrumb: 'Learners' },
    canActivate: [IsLoggedInGuard, CanAccessLearnersGuard],
  },
  {
    path: 'user-groups',
    loadChildren: () => import('@app/features/convs-mgr/user-groups').then(m => m.ConvsMgrUserGroupsModule),
    data: { breadCrumb: 'User Groups' },
    canActivate: [IsLoggedInGuard, CanAccessLearnersGuard],
  },

  {
    path: 'chats',
    loadChildren: () => import('@app/features/convs-mgr/conversations/chats').then(m => m.ConvsMgrConversationsChatsModule),
    data: { breadCrumb: 'Chats' },
    canActivate: [IsLoggedInGuard, CanAccessChatsGuard],
  },

  {
    path: 'messaging',
    loadChildren: () => import('@app/private/features/convs-mgr/message-templates').then(m => m.ConvsMgrMessageTemplatesModule),
    data: { breadCrumb: 'Messaging' },
    canActivate: [IsLoggedInGuard, CanAccessChatsGuard],
  },

  {
    path: 'assessments',
    loadChildren: () => import('@app/features/convs-mgr/conversations/assessments').then(m => m.ConvsMgrAssessmentsModule),
    data: {
      breadCrumb: { src: 'assets/svgs/breadcrumbs/assessments.svg' },
    },
    canActivate: [IsLoggedInGuard, CanAccessAssessmentsGuard],
  },

  {
    path: 'surveys',
    loadChildren: () => import('@app/features/convs-mgr/conversations/surveys').then(m => m.ConvsMgrSurveysModule),
    data: { feature: 'surveys', breadCrumb: 'Surveys' },
    canActivate: [IsLoggedInGuard , CanAccessFFlagGuard],
  },

  {
    path: 'settings',
    loadChildren: () => import('@app/private/features/convs-mgr/settings/main').then(m => m.SettingsModule),
    data: { breadCrumb: 'Settings' },
    canActivate: [IsLoggedInGuard],
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
