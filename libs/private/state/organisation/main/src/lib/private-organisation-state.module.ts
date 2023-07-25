import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrgStore }       from './stores/organisation.store';
import { ActiveOrgStore } from './stores/active-org.store';

@NgModule({
  imports: [RouterModule],
  providers: []
})

export class PrivateOrgStateModule
{
  static forRoot(): ModuleWithProviders<PrivateOrgStateModule>
  {
    return {
      ngModule: PrivateOrgStateModule,
      providers: [
        OrgStore,
        ActiveOrgStore
      ]
    };
  }
}
