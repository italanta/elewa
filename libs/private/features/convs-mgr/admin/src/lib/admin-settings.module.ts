import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { AdminPageComponent } from './pages/admin-page/admin-page.component';

import { AdminSettingsRouterModule } from './admin.routing';

@NgModule({
  imports: [CommonModule, AdminSettingsRouterModule, ConvlPageModule],
  declarations: [AdminPageComponent],
})
export class AdminSettingsModule {}
