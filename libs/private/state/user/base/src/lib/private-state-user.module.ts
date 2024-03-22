import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserStore } from './stores/user.store';

@NgModule({
  imports: [CommonModule,
            RouterModule],
  providers: []
})
export class PrivateUserStateModule
{
  static forRoot(): ModuleWithProviders<PrivateUserStateModule>
  {
    return {
      ngModule: PrivateUserStateModule,
      providers: [ UserStore ]
    };
  }
}