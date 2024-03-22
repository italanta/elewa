import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable, combineLatest, map, of, switchMap } from 'rxjs';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { SurveyPublishService, SurveyService } from '@app/state/convs-mgr/conversations/surveys';
import { StartSurveyReq } from '@app/private/model/convs-mgr/micro-apps/surveys';
import { MessageStatusRes, MessageTemplatesService } from '@app/private/state/message-templates';

import { SnackbarService } from '../../services/snackbar.service';

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
  allTemplates: any =[];
  filteredTemplates: any = [];

  templateForm: FormGroup;

  messageTemplates: MessageTemplate[];
  messageTemplates$: Observable<MessageTemplate[]>;
  templateStatus$: Observable<MessageStatusRes[]>;

  channelId: string;

  loading: boolean;

  filterForm: FormGroup;
  classFilterControl: FormControl = new FormControl('');
  courseFilterControl: FormControl = new FormControl('');
  statusFilterControl: FormControl = new FormControl('');
  searchControl: FormControl = new FormControl('');

  constructor(
    private _eLearners: EnrolledLearnersService,
    private _classroomServ$: ClassroomService,
    private _snackbar: SnackbarService,
    private _route$$: Router,
    private fb: FormBuilder,
    private _surveyService: SurveyService,
    private _templateService$: MessageTemplatesService,
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

    this.templateForm = this.fb.group({
      selectedOption: new FormControl(''), // Initialize the selectedOption control
    });
  }

  ngOnInit() {
    this.getLearners();
    this.getAllClasses();
    this.getAllCourses();
    this.getAllTemplates();

    this.channelId = localStorage.getItem('selectedChannelId') || '';

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

  getAllTemplates() {
    this.loading = true;
    this.messageTemplates$ = this._templateService$.getMessageTemplates$();

    this._sBs.sink = this.messageTemplates$.pipe(
      switchMap((templates) => {
        this.messageTemplates = templates;

        const firstTemplate = templates[0];
        if (!templates || templates.length === 0 || (!firstTemplate.channelId)) {
          this.loading = false;
          return [];
        }
        const channelId = firstTemplate ? firstTemplate.channelId : '';
    
        this.templateStatus$ = this._templateService$.getTemplateStatus(channelId);
    
        return combineLatest([of(templates), this.templateStatus$]).pipe(
          map(([templates, statusData]) => {
            const mergedData = templates.map((template) => {
              const status = (statusData['templates'].find((status: any) => template.name === status.name) || {}).status || 'N/A';
              return {
                ...template,
                status,
              };
            });
            this.loading = false;
            return mergedData;
          })
        );
      })
    ).subscribe((mergedData) => {
      this.loading = false;
      this.allTemplates = mergedData;
    });
  }

  isOptionDisabled(status: string): boolean {
    return status !== 'APPROVED';
  }

  filterTemplates(event: Event): void {
    const query = event.target as HTMLInputElement;
    this.filteredTemplates = this.allTemplates.filter((template: any) =>
      template.name.toLowerCase().includes(query.value.toLowerCase())
    );
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

  sendSurvey() {
    if(this.channelId){
      const surveyId = this._route$$.url.split('/')[2];
      const enrolledUsers = this.selection.selected;
      const surveyPayload: StartSurveyReq = {
        messageTemplateId: this.templateForm.value.selectedOption,
        
        channelId: this.channelId,
        surveyId: surveyId,
        endUserIds: []
      }
        this._surveyService.sendSurvey(surveyPayload, enrolledUsers).subscribe();
        this._snackbar.showSuccess("survey sent ");
    }
    else{
      this._snackbar.showError("Select Channel From Settings");
      this.dialogRef.close();
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
