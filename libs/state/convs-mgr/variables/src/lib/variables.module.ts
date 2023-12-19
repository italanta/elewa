import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variableBlocksStore } from './stores/variable-blocks.store';

@NgModule({
  imports: [CommonModule],
})
export class VariablesModule {
  static forRoot(): ModuleWithProviders<VariablesModule>
  {
    return {
      ngModule: VariablesModule,
      providers: [
        variableBlocksStore
      ]
    };
  }
}
