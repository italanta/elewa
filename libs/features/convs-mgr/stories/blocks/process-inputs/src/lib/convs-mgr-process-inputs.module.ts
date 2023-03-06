import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VariableInputComponent } from './components/variable-input/variable-input.component';
import { NameValidationsComponent } from './components/name-validations/name-validations.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [VariableInputComponent, NameValidationsComponent],
  exports: [VariableInputComponent],
})
export class ConvsMgrProcessInputsModule {}
