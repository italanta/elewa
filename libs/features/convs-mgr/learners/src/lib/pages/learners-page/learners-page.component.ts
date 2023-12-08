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
import { Classroom, ClassroomUpdateEnum, defaultClassroom } from '@app/model/convs-mgr/classroom';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { MessageTemplatesService, ScheduleMessageService } from '@app/private/state/message-templates';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { MessageTemplate, MessageTypes } from '@app/model/convs-mgr/functions';
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

  scheduleMessageOptions: any;
  templateMessage: MessageTemplate;

  channel: CommunicationChannel;

  constructor(
    private _channelService: CommunicationChannelService,
    private _eLearners: EnrolledLearnersService,
    private _classroomServ$: ClassroomService,
    private _liveAnnouncer: LiveAnnouncer,
    private _botServ$: BotsStateService,
    private _dialog: MatDialog,
    private _surveyService: SurveyService,
    private _messageService: MessageTemplatesService,
    private _route: ActivatedRoute,
    private _scheduleMessageService: ScheduleMessageService,
    private _route$$: Router
  ) {}

  ngOnInit() {
    this.getLearners();
    this.getAllClasses();
    this.getAllCourses();
    this.getAllPlatforms();
    this.getScheduleOptions();
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
      this.addDefaultClass();
    });
  }

  addDefaultClass() {
    const classroom = this.allClasses.find(cls => cls.className === defaultClassroom.className)
    classroom ?? this.allClasses.push(defaultClassroom);
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

  getScheduleOptions(){

    this._scheduleMessageService.optionsSet$.subscribe((options)=> {
      if(options || options.template) {
        this.scheduleMessageOptions = options;
        // TODO: Remove this redundancy
        this.templateMessage = options.template;
        this.activeMessageId = options.template.id;
        this.selectedTime = options.dispatchDate;
      }
    })
   }

   sendMessageButtonClicked() {
    const selectedUsers = this.selection.selected;
    const action = this.scheduleMessageOptions.action
    if(this.scheduleMessageOptions && this.templateMessage) {

      const basePayload = this._getBasePayload(this.templateMessage, selectedUsers);

      switch (action) {
        case 'specific-time':
          this.scheduleMessage(basePayload);
          break;
        case 'inactivity':
          this.scheduleInactivity(basePayload);
          break;
        default:
          alert('No message configuration found!')
          break;
      }
    }
  }
  
  
  scheduleMessage(payload: any) {
    const scheduleRequest = {
      ...payload,
      id: this.scheduleMessageOptions.id,
      dispatchTime: this.scheduleMessageOptions.dispatchDate,
      endDate:  this.scheduleMessageOptions.endDate || null,
      frequency: this.scheduleMessageOptions.frequency || null
    };
    
    this._sBs.sink = this._scheduleMessageService.scheduleMessage(scheduleRequest).subscribe((resp)=> {
      if(resp) {
        // TODO: Display Toast Message based on Response
        this.openTemplate(payload.id);
      }
    });
  }
  
  scheduleInactivity(payload: any) {
    const inactivityRequest = {
      ...payload,
      id: this.scheduleMessageOptions.id,
      inactivityTime: this.scheduleMessageOptions.inactivityTime
    };
  
    this._sBs.sink = this._scheduleMessageService.scheduleInactivity(inactivityRequest).subscribe((resp)=> {
      if(resp) {
        // TODO: Display Toast Message based on Response
        this.openTemplate(payload.id);
      }
    });
  }

  openTemplate(id: any){
    this._route$$.navigate(['/messaging', id]);
  }

  _getBasePayload(template: MessageTemplate, selectedUsers: EnrolledEndUser[]) {
    return {
      message: {
        type: MessageTypes.TEXT,
        name: template?.name,
        language: template?.language,
        templateType: TemplateMessageTypes.Text,
      },
      id: this.scheduleMessageOptions.id,
      channelId: template?.channelId,
      enrolledEndUsers: selectedUsers.map((user)=> user.id),
      type: this.scheduleMessageOptions.type
    };
  }
  
  sendMessageWithChannel(template: MessageTemplate, selectedUsers: EnrolledEndUser[]) {
    const channelId = template?.channelId || '';

    const payload = {
      template: template,
      type: MessageTypes.TEXT,
      templateType: TemplateMessageTypes.Text,
      enrolledEndUsers: [] as string[],
    };
  
    this._messageService.sendMessageTemplate(payload, channelId, selectedUsers).subscribe();
    
    this.openTemplate(template.id);
  }

  _getChannelDetails(channelId: string) {
    return this._channelService.getSpecificChannel(channelId);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}