import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { SubSink } from 'subsink';

import { OrganisationService } from '@app/private/state/organisation/main';
import { iTalUser } from '@app/model/user';

import { AddMemberModalComponent } from '../../modals/add-member-modal/add-member-modal.component';

@Component({
  selector: 'app-teams-settings',
  templateUrl: './teams-settings.component.html',
  styleUrls: ['./teams-settings.component.scss'],
})
export class TeamsSettingsComponent implements OnInit, OnDestroy {
  displayedColumns = ['logo', 'name', 'email', 'status', 'role', 'actions'];
  dataSource = new MatTableDataSource<iTalUser>();

  private _sBs = new SubSink();

  constructor(
    private _orgsService: OrganisationService,
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._sBs.sink = this._orgsService
      .getOrgUsersDetails()
      .subscribe((users) => {
        this.dataSource.data = users;
      });
  }

  getAvatar(user: iTalUser) {
    const names = user.displayName?.split(' ');
    const initials = names?.map(name => name.charAt(0).toUpperCase());
    return initials?.join('');
  }

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

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
