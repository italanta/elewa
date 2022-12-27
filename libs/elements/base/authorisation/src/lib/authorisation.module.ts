import { ModuleWithProviders, NgModule } from '@angular/core';

import { IsLoggedInGuard } from './auth-guards/is-logged-in.guard';
import { IsAdminGuard } from './auth-guards/is-admin.guard';

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
        IsAdminGuard
      ]
    };
  }
}
