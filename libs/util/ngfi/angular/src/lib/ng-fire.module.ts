import { NgModule } from '@angular/core';

import { AuthService } from './auth/services/auth.service';
import { BackendService } from './backend/backend.service';

/**
 * NgFire Module
 *
 * Contains: Interactions with backend, Authentication.
 */
@NgModule({
  imports: [],
  providers: [AuthService, BackendService],
  exports: []
})
export class NgFireModule { }
