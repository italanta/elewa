import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { MicroAppMainPageComponent } from './pages/micro-app-main-page/micro-app-main-page.component';

import { MicroAppsFooterComponent } from './components/micro-apps-footer/micro-apps-footer.component';
import { MicroAppsHeaderComponent } from './components/micro-apps-header/micro-apps-header.component';
import { MicroAppContentPageComponent } from './pages/micro-app-content-page/micro-app-content-page.component';
import { PlatformRedirectPageComponent } from './pages/platform-redirect-page/platform-redirect-page.component';

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
    MicroAppsFooterComponent,
    MicroAppsHeaderComponent,
    MicroAppContentPageComponent,
    PlatformRedirectPageComponent
  ],
  exports: [MicroAppMainPageComponent],
})
export class MicroAppModule {}
