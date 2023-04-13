import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';

import { VariableInputComponent } from './components/variable-input/variable-input.component';
import { NameValidationsComponent } from './components/name-validations/name-validations.component';
import { PhoneValidationsComponent } from './components/phone-validations/phone-validations.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MultiLangModule],
  declarations: [
    VariableInputComponent,
    NameValidationsComponent,
    PhoneValidationsComponent,
  ],
  exports: [VariableInputComponent],
})
export class ConvsMgrProcessInputsModule {}
