import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';

import { VariableInputComponent } from './components/variable-input/variable-input.component';
import { NameValidationsComponent } from './components/name-validations/name-validations.component';
import { LocationValidationsComponent } from './components/location-validations/location-validations.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MultiLangModule],
  declarations: [VariableInputComponent, NameValidationsComponent, LocationValidationsComponent],
  exports: [VariableInputComponent],
})
export class ConvsMgrProcessInputsModule {}
