import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';
import { ConvsMgrAssessmentsModule } from '@app/features/convs-mgr/conversations/assessments';

import { MicroAppMainPageComponent } from './pages/micro-app-main-page/micro-app-main-page.component';

import { MicroAppContentPageComponent } from './pages/micro-app-content-page/micro-app-content-page.component';
import { PlatformRedirectPageComponent } from './pages/platform-redirect-page/platform-redirect-page.component';
import { ClmMicroAppLayoutModule } from '@app/libs/elements/layout/clm-micro-app';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MultiLangModule,
    ConvsMgrAssessmentsModule,
    ClmMicroAppLayoutModule,
  ],
  declarations: [
    MicroAppMainPageComponent,
    MicroAppContentPageComponent,
    PlatformRedirectPageComponent,
  ],
  exports: [MicroAppMainPageComponent],
})
export class MicroAppModule {}
