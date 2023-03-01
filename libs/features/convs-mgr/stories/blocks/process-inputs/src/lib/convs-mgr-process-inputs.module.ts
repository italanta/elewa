import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { VariableInputComponent } from './components/variable-input/variable-input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [VariableInputComponent],
  exports: [VariableInputComponent],
})
export class ConvsMgrProcessInputsModule {}
