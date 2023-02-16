import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { OptionInputFieldComponent } from './components/option-input-field/option-input-field.component';
import { DefaultOptionFieldComponent } from './components/default-option-field/default-option-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListOptionComponent } from './components/list-option/list-option.component';
import { OptionViewFieldComponent } from './components/option-view-field/option-view-field.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,
  ],

  declarations: [
    OptionInputFieldComponent,
    DefaultOptionFieldComponent,
    ListOptionComponent,
    OptionViewFieldComponent,
  ],

  exports: [
    OptionInputFieldComponent,
    DefaultOptionFieldComponent,
    ListOptionComponent,
    OptionViewFieldComponent
  ],
})
export class ConvsMgrBlockOptionsModule {}
