import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrgStore }       from './stores/organisation.store';
import { ActiveOrgStore } from './stores/active-org.store';

@NgModule({
  imports: [RouterModule],
  providers: []
})
export class OrgStateModule
{
  static forRoot(): ModuleWithProviders<OrgStateModule>
  {
    return {
      ngModule: OrgStateModule,
      providers: [
        OrgStore,
        ActiveOrgStore
      ]
    };
  }
}
