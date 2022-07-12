import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { UserMenuComponent } from './components/user-menu/user-menu.component';

/**
 *  Elewa My User Module. Handles the users user configuration
 */
@NgModule({
  imports: [CommonModule,  RouterModule,
            MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
            ],

  declarations: [UserMenuComponent],

  providers: [],
  exports: [UserMenuComponent],
})
export class UserMenuModule { }
