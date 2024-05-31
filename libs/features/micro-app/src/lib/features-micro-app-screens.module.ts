import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MicroAppMainPageComponent } from './pages/micro-app-main-page/micro-app-main-page.component';
import { ConvsMgrAssessmentsModule } from '@app/features/convs-mgr/conversations/assessments';
import { MicroAppsFooterComponent } from './components/micro-apps-footer/micro-apps-footer.component';
import { MicroAppsHeaderComponent } from './components/micro-apps-header/micro-apps-header.component';
import { MicroAppContentPageComponent } from './pages/micro-app-content-page/micro-app-content-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MultiLangModule,

    ConvsMgrAssessmentsModule,
  ],
  declarations: [
    MicroAppMainPageComponent,
    MicroAppsFooterComponent,
    MicroAppsHeaderComponent,
    MicroAppContentPageComponent,
  ],
  exports: [MicroAppMainPageComponent],
})
export class MicroAppModule {}
