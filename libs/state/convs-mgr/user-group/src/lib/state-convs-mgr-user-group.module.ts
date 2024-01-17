import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserGroupStore } from './store/user-group.store';

@NgModule({
  imports: [CommonModule],
})
export class StateConvsMgrUserGroupModule {
  static forRoot(): ModuleWithProviders<StateConvsMgrUserGroupModule> {
    return {
      ngModule: StateConvsMgrUserGroupModule,
      providers: [UserGroupStore],
    };
  }
}
