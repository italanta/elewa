import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule
  ],
  exports: [
    MatDatepickerModule
  ]
})
export class DateConfigurationModule
{
  static forRoot(): ModuleWithProviders<DateConfigurationModule> {
    return {
      ngModule: DateConfigurationModule,
      providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        // TODO: Dynamically change date locale - https://stackoverflow.com/questions/45726463/change-language-of-datepicker-of-material-angular-4
        // { provide: MAT_DATE_LOCALE, useValue: 'nl-be' },
      ]
    };
  }
}
