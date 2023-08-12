import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPageComponent } from './pages/admin-page/admin-page.component';

import { AdminSettingsRouterModule } from './admin.routing';

@NgModule({
  imports: [CommonModule, AdminSettingsRouterModule],
  declarations: [AdminPageComponent],
})
export class AdminSettingsModule {}
