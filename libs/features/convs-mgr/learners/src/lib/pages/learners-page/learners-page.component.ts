import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';

import { SurveyService } from '@app/state/convs-mgr/conversations/surveys';
import { Classroom, ClassroomUpdateEnum } from '@app/model/convs-mgr/classroom';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { MessageTemplatesService, ScheduleMessageService } from '@app/private/state/message-templates';
import { ChannelService } from '@app/private/state/organisation/channels';

import { MessageTemplate, MessageTypes } from '@app/model/convs-mgr/functions';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { Bot } from '@app/model/convs-mgr/bots';

import { BulkActionsModalComponent } from '../../modals/bulk-actions-modal/bulk-actions-modal.component';
import { ChangeClassComponent } from '../../modals/change-class/change-class.component';
import { CreateClassModalComponent } from '../../modals/create-class-modal/create-class-modal.component';

@Component({
  selector: 'app-learners-page',
  templateUrl: './learners-page.component.html',
  styleUrls: ['./learners-page.component.scss'],
})
export class LearnersPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

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
  allCourses: Bot[] = [];

  selectedClass: any = 'Class';
  selectedCourse: any = 'Course';
  selectedPlatform: any = 'Platform';

  surveyId: string;
  templateId: string;
  selectedTime: Date;
  activeMessageId: string;

  constructor(
    private _eLearners: EnrolledLearnersService,
    private _classroomServ$: ClassroomService,
    private _liveAnnouncer: LiveAnnouncer,
    private _botServ$: BotsStateService,
    private _dialog: MatDialog,
    private _surveyService: SurveyService,
    private _messageService: MessageTemplatesService,
    private _route: ActivatedRoute,
    private _scheduleMessageService: ScheduleMessageService,
    private _route$$: Router,
    private _channelService: ChannelService
  ) {}

  ngOnInit() {
    this.getLearners();
    this.getAllClasses();
    this.getAllCourses();
    this.getAllPlatforms();
    this.getSurveyId();
  }
  
  getSurveyId(){
    this.surveyId= this._route.snapshot.queryParamMap.get('surveyId') || '';
    this.getActiveMessageTemplate();
  }

  getLearners() {
    const allLearners$ = this._eLearners.getAllLearners$();

    this._sBs.sink = allLearners$.subscribe((alllearners) => {
      this.dataSource.data = alllearners;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  getAllClasses() {
    this._sBs.sink = this._classroomServ$.getAllClassrooms().subscribe((allClasses) => {
      this.allClasses = allClasses
    });
  }

  getAllCourses() {
    this._sBs.sink = this._botServ$.getBots().subscribe((courses) => this.allCourses = courses)
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

  getIcon(status: number) {
    return `/assets/svgs/learners/${this.getStatus(status)}.svg`
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

  filterTable(event: Event, mode:string) {
    switch (mode) {
      case 'class':
        this.dataSource.filter = this.selectedClass.ClassName;
        break
    }
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

  sendSurvey() {
    const selectedPhoneNumbers = this.selection.selected.map((user) => user.id);
    this._surveyService.sendSurvey({surveyId: this.surveyId, enrolledUserIds:selectedPhoneNumbers }).subscribe();
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

  getActiveMessageTemplate(){
    this.activeMessageId = this._route.snapshot.queryParamMap.get('templateId') ?? '';
    const dispatchDateQueryParam = this._route.snapshot.queryParamMap.get('dispatchDate');

    if (dispatchDateQueryParam) {
      this.selectedTime = new Date(dispatchDateQueryParam);
    }
   }

   sendMessageButtonClicked() {
    const selectedPhoneNumbers = this.selection.selected.map((user) => user.phoneNumber) as string[];
    const endUserIds = this.selection.selected.map((user) => user.id) as string[];
  
    this._sBs.sink = this._messageService.getTemplateById(this.activeMessageId).subscribe((template) => {
      if (template) {
        if (this.selectedTime) {
          this.scheduleMessage(template, endUserIds);
        } else {
          this.sendMessageWithChannel(template, selectedPhoneNumbers);
        }
      }
    });
  }
  
  
  scheduleMessage(template: MessageTemplate, endUserIds: string[]) {
    const scheduleRequest = {
      message: {
        type: MessageTypes.TEXT,
        name: template?.name,
        language: template?.language,
        templateType: TemplateMessageTypes.Text,
      },
      channelId: template?.channelId,
      dispatchTime: this.selectedTime,
      endUsers: endUserIds,
    };
  
    this._sBs.sink = this._scheduleMessageService.scheduleMessage(scheduleRequest).subscribe();
    this.openTemplate(template.id);
  }

  openTemplate(id: any){
    this._route$$.navigate(['/messaging', id]);

  }
  
  sendMessageWithChannel(template: MessageTemplate, selectedPhoneNumbers: string[]) {
    const channelId = template?.channelId || '';
  
    this._messageService.sendMessageTemplate({
      endUsers: selectedPhoneNumbers,
      template: template,
      type: MessageTypes.TEXT,
      templateType: TemplateMessageTypes.Text
    }, channelId)
    .subscribe();
    this.openTemplate(template.id);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}