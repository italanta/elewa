import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndUsersStore } from './store/end-user.store';

@NgModule({
  imports: [CommonModule],
})
export class EndUsersStateModule {
  static forRoot(): ModuleWithProviders<EndUsersStateModule> {
    return {
      ngModule: EndUsersStateModule,
      providers: [EndUsersStore],
    };
  }
}
