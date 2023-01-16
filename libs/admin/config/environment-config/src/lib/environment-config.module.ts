
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  imports: [],
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
