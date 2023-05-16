import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AssessmentBrickComponent } from './components/assessment-brick/assessment-brick.component';

import { ConvsMgrBlockOptionsModule } from '../../../block-options/src';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,

    ConvsMgrBlockOptionsModule
  ],
  declarations: [AssessmentBrickComponent],

  exports: [AssessmentBrickComponent]

})
export class ConvsMgrAssessmentBrickModule {}
