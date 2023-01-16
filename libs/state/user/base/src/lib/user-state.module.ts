import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserStore } from './stores/user.store';

@NgModule({
  imports: [RouterModule],
  providers: []
})
export class UserStateModule
{
  static forRoot(): ModuleWithProviders<UserStateModule>
  {
    return {
      ngModule: UserStateModule,
      providers: [ UserStore ]
    };
  }
}
