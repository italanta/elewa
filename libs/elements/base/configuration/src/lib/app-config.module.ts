import { ModuleWithProviders, NgModule } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { CommonModule } from '@angular/common';

import { Logger, TransclusionHelper, EventLogger, MoneyPipe } from '@iote/bricks-angular';

import { ProductionLogger } from './tools/production-logger.provider';
import { DebugLogger }      from './tools/debug-logger.provider';
import { AppEventLogger }   from './tools/app-event-logger.provider';

@NgModule({
  imports: [CommonModule]
})
export class AppConfigurationModule
{
  static forRoot(environment: any, production: boolean): ModuleWithProviders<AppConfigurationModule>
  {
    return {
      ngModule: AppConfigurationModule,
      providers: [
        { provide: 'ENVIRONMENT', useValue: environment },
        { provide: Logger, useClass: production ? ProductionLogger : DebugLogger },
        { provide: EventLogger, useClass: AppEventLogger },
        TransclusionHelper,
        MoneyPipe,
        { provide: STEPPER_GLOBAL_OPTIONS,  useValue: { displayDefaultIndicatorType: false } }
      ]
    };
  }
}


