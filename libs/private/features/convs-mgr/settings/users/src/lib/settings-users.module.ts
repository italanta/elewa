import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AccessControlModule } from '@app/private/elements/convs-mgr/access-control';

import { UsersComponent } from './components/users/users.component';

import { NewUserDialogComponent } from './modals/new-user-dialog/new-user-dialog.component';
import { UpdateUserModalComponent } from './modals/update-user-modal/update-user-modal.component';
import { RolePipe } from './custom-pipes/role.pipe';


@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,

    MaterialDesignModule,
    FlexLayoutModule,
    MaterialFormBricksModule,
    MaterialBricksModule,
    FormsModule,

    AccessControlModule,
    ReactiveFormsModule,
  ],
  declarations: [
    UsersComponent,
    NewUserDialogComponent,
    UpdateUserModalComponent,
    RolePipe
  ],
  exports: [
    UsersComponent
  ]
})
export class SettingsUsersModule {}
