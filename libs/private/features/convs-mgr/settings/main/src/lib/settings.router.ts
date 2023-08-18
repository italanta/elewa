import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

// import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const SETTINGS_ROUTES: Route[] = [
  // { path: '', component: SettingsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(SETTINGS_ROUTES)],
  exports: [RouterModule]
})
export class SettingsRouterModule { }
