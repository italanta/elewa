import { ModuleWithProviders, NgModule } from '@angular/core';

import { IsLoggedInGuard } from './auth-guards/is-logged-in.guard';
import { IsAdminGuard } from './auth-guards/is-admin.guard';

//route guards
import { CanAccessBotsGuard } from './route-guards/bots/can-view-bots.guard';
import { CanAccessAssessmentsGuard } from './route-guards/assessments/can-view-assessments.guard';
import { CanAccessAnalyticsGuard } from './route-guards/analytics/can-view-analytics.guard';
import { CanAccessChatsGuard } from './route-guards/chats/can-view-chats.guard';
import { CanAccessLearnersGuard } from './route-guards/learners/can-view-learners.guard';

/**
 * Authorisation module. Contains Auth Guards & Access Control Directives
 */
@NgModule({
  imports: [],
  declarations: [],
  providers: [],
  exports: [],
})
export class AuthorisationModule
{
  static forRoot(environment: any, production: boolean): ModuleWithProviders<AuthorisationModule>
  {
    return {
      ngModule: AuthorisationModule,
      providers: [
        IsLoggedInGuard,
        IsAdminGuard,

        // route guards
        CanAccessBotsGuard,
        CanAccessAssessmentsGuard,
        CanAccessAnalyticsGuard,
        CanAccessChatsGuard,
        CanAccessLearnersGuard
      ]
    };
  }
}
