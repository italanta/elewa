import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OptionInputFieldComponent } from './components/option-input-field/option-input-field.component';

@NgModule({
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [OptionInputFieldComponent],

  exports: [OptionInputFieldComponent]
})
export class ConvsMgrInputFieldsModule {}
