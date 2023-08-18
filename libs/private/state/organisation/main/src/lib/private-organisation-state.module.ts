import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrgStore }       from './stores/organisation.store';
import { ActiveOrgStore } from './stores/active-org.store';
import { PermissionsStore } from './stores/permissions.store';

@NgModule({
  imports: [RouterModule],
  providers: []
})

export class MtOrgStateModule
{
  static forRoot(): ModuleWithProviders<MtOrgStateModule>
  {
    return {
      ngModule: MtOrgStateModule,
      providers: [
        OrgStore,
        ActiveOrgStore,
        PermissionsStore
      ]
    };
  }
}
