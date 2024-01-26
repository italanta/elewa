import * as moment from 'moment';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { SubSink } from 'subsink';


import { Router } from '@angular/router';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { MatDialog } from '@angular/material/dialog';
import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Timestamp } from '@firebase/firestore-types';
import { __DateFromStorage } from '@iote/time';

import { AddUserToGroupModalComponent } from '../../modals/add-user-to-group-modal/add-user-to-group-modal.component';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-single-group-user-list',
  templateUrl: './single-group-user-list.component.html',
  styleUrls: ['./single-group-user-list.component.scss'],
})
export class SingleGroupUserListComponent implements OnInit, OnDestroy
{
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  _sbs = new SubSink();

  displayedColumns = [
    'name',
    'phonenumber',
    'date-enrolled',
    'status'
  ];

  dataSource = new MatTableDataSource<EnrolledEndUser>();
  classRoom: any;
  selection = new SelectionModel<EnrolledEndUser>(true, []);

  classRoomId = '';

  constructor(
    private _dialog: MatDialog,
    private classroomService: ClassroomService,
    private _learnerService: EnrolledLearnersService,
    private _liveAnnouncer: LiveAnnouncer,
    private router$$: Router
  )
  {
    this.classRoomId = this.router$$.url.split('/')[2].toString();
  }

  ngOnInit()
  {
    this.loadClassroomLearners();
  }

  loadClassroomLearners()
  {
   this._sbs.sink = this._learnerService.getLearnersFromClass(this.classRoomId)
      .pipe(take(1))
        .subscribe((learners) => this.dataSource.data = learners);
  }
  sortData(sortState: Sort)
  {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openAddModal()
  {
    const dialogRef = this._dialog.open(AddUserToGroupModalComponent, {
      data: this.classRoom
    });

    dialogRef.afterClosed().subscribe((result: Classroom) =>
    {
      if (result) {
        this.addUserGroup(result);
      }
    });
  }

  masterToggle()
  {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.map((row) => this.selection.select(row));
    }
  }

  isSomeSelected()
  {
    return this.selection.selected.length > 0;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected()
  {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  getIcon(status: number)
  {
    return `/assets/svgs/learners/${this.getStatus(status)}.svg`;
  }

  formatDate(date: Timestamp) 
  {
    return __DateFromStorage(date).format('MMM DD, YYYY')
  }

  getStatus(status: number) {
    return (
      EnrolledEndUserStatus[status].charAt(0).toUpperCase() +
      EnrolledEndUserStatus[status].slice(1)
    );
  }


  addUserGroup(classroom: Classroom)
  {
    this.classroomService.addClassroom(classroom).subscribe(() =>
    {
      // this.loadClassroom();
    });
  }
  
  ngOnDestroy(): void {
    this._sbs.unsubscribe();
  }
}
