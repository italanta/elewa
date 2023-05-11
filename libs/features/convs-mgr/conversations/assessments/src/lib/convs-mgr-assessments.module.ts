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
import { CreateAssessmentModalComponent } from './modals/create-assessment-modal/create-assessment-modal.component';
import { AssessmentsRouterModule } from './assessments.router.module';
import { AssessmentService } from './services/assessment.service';
import { AssessmentViewComponent } from './pages/assessment-view/assessment-view.component';
import { AssessmentListItemComponent } from './components/assessment-list-item/assessment-list-item.component';
import { AssessmentEditComponent } from './pages/assessment-edit/assessment-edit.component';

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
                 AssessmentViewComponent,
                 AssessmentListItemComponent,
                 AssessmentEditComponent,
                 CreateAssessmentModalComponent],
  providers: [AssessmentService,
              AssessmentsStore]
})
export class ConvsMgrAssessmentsModule {}
