import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

@Component({
  selector: 'app-send-modal',
  templateUrl: './send-modal.component.html',
  styleUrls: ['./send-modal.component.scss'],
})
export class SendModalComponent implements OnInit {
  private _sBs = new SubSink();

  dataSource = new MatTableDataSource<EnrolledEndUser>();
  selection = new SelectionModel<EnrolledEndUser>(true, []);
  displayedColumns: string[] = ['Select', 'Name', 'Phone Number'];

  allClasses: Classroom[] = [];
  allCourses: string[] = [];
  allLearn: EnrolledEndUser[] = [];

  filterForm: FormGroup;
  classFilterControl: FormControl = new FormControl('');
  courseFilterControl: FormControl = new FormControl('');
  statusFilterControl: FormControl = new FormControl('');
  searchControl: FormControl = new FormControl('');

  constructor(
    private _eLearners: EnrolledLearnersService,
    private _classroomServ$: ClassroomService,
    public dialogRef: MatDialogRef<SendModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize the filter form group with your form controls
    this.filterForm = new FormGroup({
      classFilter: this.classFilterControl,
      courseFilter: this.courseFilterControl,
      statusFilter: this.statusFilterControl,
      search: this.searchControl,
    });
  }

  ngOnInit() {
    this.getLearners();
    this.getAllClasses();
    this.getAllCourses();

    // Subscribe to changes in filter form controls and search input
    this.classFilterControl.valueChanges.subscribe(() => this.filterData());
    this.courseFilterControl.valueChanges.subscribe(() => this.filterData());
    this.statusFilterControl.valueChanges.subscribe(() => this.filterData());
    this.searchControl.valueChanges.subscribe(() => this.filterData());
  }

  getLearners() {
    const allLearners$ = this._eLearners.getAllLearners$();

    this._sBs.sink = allLearners$.subscribe((alllearners) => {
      this.allLearn = alllearners;
      this.dataSource.data = this.allLearn;
    });
  }

  getAllClasses() {
    this._sBs.sink = this._classroomServ$.getAllClassrooms().subscribe((allClasses) => {
      this.allClasses = allClasses;
    });
  }

  // TODO: Implement the function to get all courses
  getAllCourses() {
    this.allCourses = [];
    // Implement the logic to retrieve all courses
  }

  searchTable(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  filterData() {
    const classFilterValue = this.classFilterControl.value;
    const courseFilterValue = this.courseFilterControl.value;
    const statusFilterValue = this.statusFilterControl.value.toLowerCase();
    const searchValue = this.searchControl.value.toLowerCase();

    const filteredData = this.allLearn.filter((item: any) => {
      const isClassMatch = !classFilterValue || item.classId === classFilterValue;
      const isCourseMatch = !courseFilterValue || item.course === courseFilterValue;
      const isStatusMatch = !statusFilterValue || item.status.toLowerCase().includes(statusFilterValue);
      const isSearchMatch = !searchValue || item.name.toLowerCase().includes(searchValue);

      return isClassMatch && isCourseMatch && isStatusMatch && isSearchMatch;
    });

    this.dataSource.data = filteredData;
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
