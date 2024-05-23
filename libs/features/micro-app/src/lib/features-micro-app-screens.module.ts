import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MicroAppMainPageComponent } from './pages/micro-app-main-page/micro-app-main-page.component';
import { MicroAppsHeaderComponent } from './components/micro-apps-header/micro-apps-header.component';
import { MicroAppsFooterComponent } from './components/micro-apps-footer/micro-apps-footer.component';
import { ContentSectionComponent } from './components/content-section/content-section.component';
import { AssessmentCardComponent } from './components/assessment-card/assessment-card.component';
import { AssessmentHeaderComponent } from './components/assessment-header/assessment-header.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MultiLangModule,
  ],
  declarations: [
    MicroAppMainPageComponent,
    MicroAppsHeaderComponent,
    MicroAppsFooterComponent,
    ContentSectionComponent,
    AssessmentCardComponent,
    AssessmentHeaderComponent
  ],
  exports: [
    MicroAppMainPageComponent
  ]
})
export class MicroAppModule {}
