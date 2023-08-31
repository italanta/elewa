import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MatSelectFilterModule } from 'mat-select-filter';

/**
 *  Elewa My User Module. Handles the users user configuration
 */
@NgModule({
  imports: [RouterModule, MatSelectFilterModule,
            MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,CommonModule
            ],

  declarations: [UserMenuComponent],

  providers: [],
  exports: [UserMenuComponent],
})
export class UserMenuModule { }
