import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from '@app/elements/base/authorisation';

import { AdminPageComponent } from './pages/admin-page/admin-page.component';

const ADMIN_SETTINGS_ROUTES: Routes = [
  { path: '', component: AdminPageComponent, canActivate: [IsLoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(ADMIN_SETTINGS_ROUTES)],
  exports: [RouterModule]
})
export class AdminSettingsRouterModule { }
