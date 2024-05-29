import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiLangModule } from '@ngfi/multi-lang';
import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MicroAppManagementService } from '@app/libs/state/convs-mgr/micro-app';

import { AssessmentMicroAppBlockComponent } from './components/assessment-micro-app-block/assessment-micro-app-block.component';

@NgModule({
  imports: [CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,

    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AssessmentMicroAppBlockComponent
  ],
  exports: [
    AssessmentMicroAppBlockComponent
  ],
  providers: [
    MicroAppManagementService
  ]
})
export class ConvsMgrAssessmentMicroAppModule {}
