import { NgModule, ModuleWithProviders } from '@angular/core';

import { ProgressMonitoringStore } from './stores/progress-monitoring.store';

@NgModule({
  imports: [],
})
export class ProgressMonitoringStateModule {
  static forRoot(): ModuleWithProviders<ProgressMonitoringStateModule> {
    return {
      ngModule: ProgressMonitoringStateModule,
      providers: [ProgressMonitoringStore],
    };
  }
}
