
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: []
})
export class EnvironmentConfigModule
{
  static forRoot(environment: any): ModuleWithProviders<EnvironmentConfigModule> {
    return {
      ngModule: EnvironmentConfigModule,
      providers: [
        { provide: 'ENVIRONMENT', useValue: environment },
      ]
    };
  }
}
