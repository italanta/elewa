import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { Classroom, ClassroomUpdateEnum } from '@app/model/convs-mgr/classroom';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';

import { BulkActionsModalComponent } from '../../modals/bulk-actions-modal/bulk-actions-modal.component';
import { MessageTemplatesService } from '@app/private/state/message-templates';
import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeClassComponent } from '../../modals/change-class/change-class.component';
import { CreateClassModalComponent } from '../../modals/create-class-modal/create-class-modal.component';

@Component({
  selector: 'app-learners-page',
  templateUrl: './learners-page.component.html',
  styleUrls: ['./learners-page.component.scss'],
})
export class LearnersPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  private _sBs = new SubSink();

  displayedColumns = [
    'select',
    'name',
    'phone',
    'course',
    'class',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<EnrolledEndUser>();
  selection = new SelectionModel<EnrolledEndUser>(true, []);

  allClasses: Classroom[] = [];
  allPlatforms: string[] = [];
  allCourses: string[] = [];
  activeMessageId: string;

  selectedClass: any = 'Class';
  selectedCourse: any = 'Course';
  selectedPlatform: any = 'Platform';
  templateId: string;

  constructor(
    private _eLearners: EnrolledLearnersService,
    private _classroomServ$: ClassroomService,
    private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _messageService: MessageTemplatesService,
    private _route: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    this.getLearners();
    this.getAllClasses();
    this.getAllCourses();
    this.getAllPlatforms();
    this.getActiveMessageTemplate();
  }

  getLearners() {
    const allLearners$ = this._eLearners.getAllLearners$();

    this._sBs.sink = allLearners$.subscribe((alllearners) => {
      this.dataSource.data = alllearners;
      this.dataSource.sort = this.sort;
    });
  }

  getActiveMessageTemplate(){
    this.activeMessageId = this._route.snapshot.queryParamMap.get('templateId') ?? '';
    debugger;
  }
  // TODO: Connect to send message service
  sendMessageButtonClicked(){
    const learners = this.selection;
    const template = this.activeMessageId;
    this._messageService.sendMessageTemplate({learners, template});
  }

  // TODO: get all classes
  getAllClasses() {
    this._sBs.sink = this._classroomServ$.getAllClassrooms().subscribe((allClasses) => {
      this.allClasses = allClasses
    });
  }

  //TODO: get all courses
  getAllCourses() {
    this.allCourses = [];
  }

  getAllPlatforms() {
    this.allPlatforms = ['Whatsapp', 'Messenger'];
  }

  getClassName(id: string) {
    return this.allClasses.find((classroom => classroom.id === id))?.className
  }

  getStatus(status: number) {
    return (
      EnrolledEndUserStatus[status].charAt(0).toUpperCase() +
      EnrolledEndUserStatus[status].slice(1)
    );
  }

  getMode(enrolledUser: EnrolledEndUser) {
    return enrolledUser.classId
      ? ClassroomUpdateEnum.ChangeClass
      : ClassroomUpdateEnum.AddToClass;
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

  openChangeClassModal(event: Event, enrolledUsr: EnrolledEndUser) {
    event.stopPropagation();
    const mode = this.getMode(enrolledUsr);

    this._dialog.open(ChangeClassComponent, {
      data: { enrolledUsr, mode },
      width: '400px',
    });
  }

  openCreateClassModal() {
    this._dialog.open(CreateClassModalComponent, {
      width: '400px',
    });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
