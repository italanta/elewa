import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateUserGroupComponent } from '../../modals/create-user-group/create-user-group.component';

@Component({
  selector: 'app-user-groups-header',
  templateUrl: './user-groups-header.component.html',
  styleUrls: ['./user-groups-header.component.scss'],
})
export class UserGroupsHeaderComponent {
  constructor(private _dialog: MatDialog) {}
  
  openCreateModal() {
    const dialogRef = this._dialog.open(CreateUserGroupComponent);
  }

}
