import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OrgStore }       from './stores/organisation.store';
import { ActiveOrgStore } from './stores/active-org.store';

@NgModule({
  imports: [CommonModule,
             RouterModule],
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
