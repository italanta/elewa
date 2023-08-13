import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { AddMemberModalComponent } from '../../modals/add-member-modal/add-member-modal.component';

@Component({
  selector: 'app-teams-settings',
  templateUrl: './teams-settings.component.html',
  styleUrls: ['./teams-settings.component.scss'],
})
export class TeamsSettingsComponent {
  displayedColumns = ['logo', 'name', 'email', 'status', 'role', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog
  ) {}

  openAddMemberDialog() {
    this._dialog.open(AddMemberModalComponent, {
      height: 'auto',
      width: '500px',
    });
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
