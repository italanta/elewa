import { ModuleWithProviders, NgModule } from '@angular/core';

import { VariablesConfigStore } from './stores/variables-config.store';

@NgModule({
  imports: [],
})
export class VariablesConfigStateModule {
  static forRoot(): ModuleWithProviders<VariablesConfigStateModule> {
    return {
      ngModule: VariablesConfigStateModule,
      providers: [
        VariablesConfigStore
      ]
    };
  }
}