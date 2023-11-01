import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
} from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { OptionInputFieldComponent } from './components/option-input-field/option-input-field.component';
import { DefaultOptionFieldComponent } from './components/default-option-field/default-option-field.component';
import { ListOptionComponent } from './components/list-option/list-option.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,
    FormsModule,
    ReactiveFormsModule,
    MultiLangModule
  ],

  declarations: [
    OptionInputFieldComponent,
    DefaultOptionFieldComponent,
    ListOptionComponent,
  ],

  exports: [
    OptionInputFieldComponent,
    DefaultOptionFieldComponent,
    ListOptionComponent,
  ],
})
export class ConvsMgrBlockOptionsModule { }
