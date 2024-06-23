import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AssessmentBrickComponent } from './components/assessment-brick/assessment-brick.component';

import { ConvsMgrBlockOptionsModule } from '../../../block-options/src';
import { AssessmentService, StateAssessmentsModule } from '@app/state/convs-mgr/conversations/assessments';

@NgModule({ declarations: [AssessmentBrickComponent],
    exports: [AssessmentBrickComponent], imports: [CommonModule,
        MultiLangModule,
        MaterialDesignModule,
        FlexLayoutModule,
        MaterialBricksModule,
        FormsModule,
        ReactiveFormsModule,
        ConvsMgrBlockOptionsModule,
        StateAssessmentsModule], providers: [AssessmentService, provideHttpClient(withInterceptorsFromDi())] })
export class ConvsMgrAssessmentBrickModule {}
