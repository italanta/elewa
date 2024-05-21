import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MicroAppMainPageComponent } from './pages/micro-app-main-page/micro-app-main-page.component';
import { MicroAppsHeaderComponent } from './components/micro-apps-header/micro-apps-header.component';

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
  ],
  exports: [
    MicroAppMainPageComponent
  ]
})
export class MicroAppScreensModule {}
