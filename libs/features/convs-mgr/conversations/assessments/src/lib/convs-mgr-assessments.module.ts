import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsHomeComponent } from './pages/assessments-home/assessments-home.component';
import { AssessmentsRouterModule } from './assessments.router.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { MaterialBricksModule, MaterialDesignModule } from '@iote/bricks-angular';

@NgModule({
  imports: [CommonModule,
            AssessmentsRouterModule,
            MaterialBricksModule,
            MaterialDesignModule,
            RouterModule,
            FormsModule,
            ReactiveFormsModule,
            ConvlPageModule,
            FlexLayoutModule,
          ],
  declarations: [AssessmentsHomeComponent],
})
export class ConvsMgrAssessmentsModule {}
