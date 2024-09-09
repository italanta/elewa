import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AssessmentService, StateAssessmentsModule } from '@app/state/convs-mgr/conversations/assessments';
import { CustomComponentsModule } from '@app/elements/layout/convs-mgr/custom-components';

import { AssessmentBrickComponent } from './components/assessment-brick/assessment-brick.component';

import { ConvsMgrBlockOptionsModule } from '../../../block-options/src';

@NgModule({ declarations: [AssessmentBrickComponent],
    exports: [AssessmentBrickComponent], imports: [CommonModule,
        MultiLangModule,
        MaterialDesignModule,
        FlexLayoutModule,
        MaterialBricksModule,
        FormsModule,
        ReactiveFormsModule,
        ConvsMgrBlockOptionsModule,
        CustomComponentsModule,
        StateAssessmentsModule], providers: [AssessmentService, provideHttpClient(withInterceptorsFromDi())] })
export class ConvsMgrAssessmentBrickModule {}
