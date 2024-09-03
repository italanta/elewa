import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { Timestamp } from '@firebase/firestore-types';
import { __DateFromStorage } from '@iote/time';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

import { AddUserToGroupModalComponent } from '../../modals/add-user-to-group-modal/add-user-to-group-modal.component';
import { MoveUsersToGroupModalComponent } from '../../modals/move-users-to-group-modal/create-bot-modal/move-users-to-group-modal.component';
import { DeleteUserFromGroupModalComponent } from '../../modals/delete-user-from-group-modal/delete-user-from-group-modal.component';
@Component({
  selector: 'app-single-group-user-list',
  templateUrl: './single-group-user-list.component.html',
  styleUrls: ['./single-group-user-list.component.scss'],
})
export class SingleGroupUserListComponent implements OnInit, OnDestroy
{
  @ViewChild(MatSort) set matSort(sort: MatSort){
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() classroom: Classroom;

  emptyPageStyle = {
    'padding-top': '7rem'
  }

  _sbs = new SubSink();

  allPlatforms: string[] = ['whatsapp', 'messenger'];
  allStatus = [{name: 'Active', value: 1}, {name: 'Inactive', value: 2}];

  allLearners: EnrolledEndUser[] = [];

  displayedColumns = [
    'select',
    'name',
    'phonenumber',
    'date-enrolled',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<EnrolledEndUser>();
  selection = new SelectionModel<EnrolledEndUser>(true, []);

  destinationClass: Classroom;

  constructor(
    private _dialog: MatDialog,
    private classroomService: ClassroomService,
    private _learnerService: EnrolledLearnersService,
    private _liveAnnouncer: LiveAnnouncer,
  ) { }

  ngOnInit()
  {
    this.loadClassroomLearners();
    console.log(this.dataSource)
  }

  loadClassroomLearners()
  {
    const classId = this.classroom.id as string;

    this._sbs.sink = this._learnerService.getLearnersFromClass(classId)
      .subscribe((learners) => {
        this.dataSource.data = learners;
        this.allLearners = learners;
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
  }

  filterTable(event: Event, mode:string) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    switch (mode) {
      case 'platform':
        this.filterLearnersByPlatform(selectedValue);
        break;
      case 'status':
        this.filterLearnersByStatus(selectedValue);
        break
    }
  }

  filterLearnersByPlatform(selectedPlatform: string): void {
    if (selectedPlatform === 'allPlatforms') {
      this.dataSource.data = this.allLearners;
      return;
    }

    const filteredLearners = this.allLearners.filter((learner) => {
      if(!learner.platformDetails) return undefined;
      return learner.platformDetails[selectedPlatform]
    });
    this.dataSource.data = filteredLearners;
  }

  filterLearnersByStatus(selectedStatus: string): void {
    if (selectedStatus === 'allStatus') {
      this.dataSource.data = this.allLearners;
      return;
    }

    const filteredLearners = this.allLearners.filter((learner) => learner.status === parseInt(selectedStatus));
    this.dataSource.data = filteredLearners;
  }

  sortData(sortState: Sort)
  {
    if (sortState.direction == 'asc') {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else if(sortState.direction == 'desc'){
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  searchTable(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  openAddModal()
  {
    this._dialog.open(AddUserToGroupModalComponent, {
      data: this.classroom
    });
  }

  deleteUserFromGroupModal(learner: EnrolledEndUser)
  {
    this._dialog.open(DeleteUserFromGroupModalComponent, {
      data: {
        classroom: this.classroom,
        learner 
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
    return __DateFromStorage(date).format('MMM DD, YYYY');
  }

  getStatus(status: number)
  {
    return (
      EnrolledEndUserStatus[status].charAt(0).toUpperCase() +
      EnrolledEndUserStatus[status].slice(1)
    );
  }

  deleteSelectedUsers() {
    this.selection.selected.forEach((user)=> 
          this.deleteUserFromGroupModal(user));
  }

  deleteUsersModal() {
    this._dialog.open(MoveUsersToGroupModalComponent, {
      data: {
        currentClass: this.classroom,
        users: this.selection.selected
      }
    });
  }

  moveUsersModal() {
    this._dialog.open(MoveUsersToGroupModalComponent, {
      data: {
        currentClass: this.classroom,
        users: this.selection.selected
      }
    });
  }

  ngOnDestroy(): void
  {
    this._sbs.unsubscribe();
  }
}
