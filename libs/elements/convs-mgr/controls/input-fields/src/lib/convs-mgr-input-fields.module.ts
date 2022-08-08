import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OptionInputFieldComponent } from './components/option-input-field/option-input-field.component';
import { DefaultOptionFieldComponent } from './components/default-option-field/default-option-field.component';

@NgModule({
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule
  ],

  declarations: [
    OptionInputFieldComponent,
    DefaultOptionFieldComponent
  ],

  exports: [
    OptionInputFieldComponent,
    DefaultOptionFieldComponent
  ],
})
export class ConvsMgrInputFieldsModule {}
