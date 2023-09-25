import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';

import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

import { BulkActionsModalComponent } from '../../modals/bulk-actions-modal/bulk-actions-modal.component';

@Component({
  selector: 'app-learners-page',
  templateUrl: './learners-page.component.html',
  styleUrls: ['./learners-page.component.scss'],
})
export class LearnersPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  private _sBs = new SubSink();

  displayedColumns = ['select', 'name', 'phone', 'course', 'class', 'status', 'actions'];

  dataSource = new MatTableDataSource<EnrolledEndUser>();
  selection = new SelectionModel<EnrolledEndUser>(true, []);

  allClasses: string[] = [];
  allPlatforms: string[] = [];
  allCourses: string[] = [];

  selectedClass: any = 'Class';
  selectedCourse: any = 'Course';
  selectedPlatform: any = 'Platform';

  constructor(
    private _eLearners: EnrolledLearnersService,
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getLearners();
    this.getAllClasses();
    this.getAllCourses();
    this.getAllPlatforms();
  }

  getLearners() {
    const allLearners$ = this._eLearners.getAllLearners$();

    this._sBs.sink = allLearners$.subscribe((alllearners) => {
      this.dataSource.data = alllearners;
      this.dataSource.sort = this.sort;
    });
  }

  // TODO: get all classes
  getAllClasses() {
    this.allClasses = [];
  }

  //TODO: get all courses
  getAllCourses() {
    this.allCourses = [];
  }

  getAllPlatforms() {
    this.allPlatforms = ['Whatsapp', 'Messenger'];
  }

  getStatus(status: number) {
    return (
      EnrolledEndUserStatus[status].charAt(0).toUpperCase() +
      EnrolledEndUserStatus[status].slice(1)
    );
  }

  searchTable(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.map((row) => this.selection.select(row));
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openBulkActionsDialog(): void {
    this._dialog.open(BulkActionsModalComponent, {
      data: { selectedUsers: this.selection.selected },
      height: '300px',
      width: '400px',
    });
  }

  openUpdateUserClassDialog() {
    this._dialog.open(BulkActionsModalComponent, {
      data: { selectedUsers: this.selection.selected },
      height: '300px',
      width: '400px',
    });
  }

  openCreateClassDialog(): void {
    this._dialog.open(BulkActionsModalComponent, {
      data: { selectedUsers: this.selection.selected },
      height: '300px',
      width: '400px',
    });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
