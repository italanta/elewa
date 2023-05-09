import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { AssessmentPaginatorComponent } from './components/assessment-paginator/assessment-paginator.component';
import { AssessmentsRouterModule } from './assessments.router.module';
import { AssessmentService } from './services/assessment.service';

@NgModule({
  imports: [CommonModule,
            AssessmentsRouterModule,
            MaterialBricksModule,
            MaterialDesignModule,
            MultiLangModule,
            RouterModule,
            FormsModule,
            ReactiveFormsModule,
            ConvlPageModule,
            FlexLayoutModule
          ],
  declarations: [AssessmentsHomeComponent,
                 AssessmentListComponent,
                 AssessmentPaginatorComponent],
  providers: [AssessmentService,
              AssessmentsStore]
})
export class ConvsMgrAssessmentsModule {}
