import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  MaterialDesignModule,
  MaterialBricksModule,
  FlexLayoutModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang'
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { AppLogoutComponent } from './components/app-logout/app-logout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
/**
 *  Elewa My User Module. Handles the users user configuration
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLangModule,
    MaterialDesignModule,
    MaterialBricksModule,
    FlexLayoutModule,
    FontAwesomeModule
  ],

  declarations: [UserMenuComponent, AppLogoutComponent],

  providers: [],
  exports: [UserMenuComponent],
})
export class UserMenuModule {}
