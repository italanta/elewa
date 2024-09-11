import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';

import { SubSink } from 'subsink';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ActiveMessageTemplateStore, MessageTemplatesService, ScheduleMessageService } from '@app/private/state/message-templates';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { TemplateMessage, TemplateMessageTypes } from '@app/model/convs-mgr/conversations/messages';
import { MessageTypes, ScheduledMessage, ScheduleOptionType } from '@app/model/convs-mgr/functions';
import { Bot } from '@app/model/convs-mgr/bots';

import { BulkActionsModalComponent } from '../../modals/bulk-actions-modal/bulk-actions-modal.component';
import { ChangeClassComponent } from '../../modals/change-class/change-class.component';
import { CreateClassModalComponent } from '../../modals/create-class-modal/create-class-modal.component';
import { filterLearnersByClass, filterLearnersByCourse, filterLearnersByPlatform, filterLearnersByStatus } from '../../utils/learner-filter.util';
import { switchMap, tap } from 'rxjs';

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
  ];

  dataSource = new MatTableDataSource<EnrolledEndUser>();
  selection = new SelectionModel<EnrolledEndUser>(true, []);

  EnrolledEndUserStatus = EnrolledEndUserStatus;
  allLearners: EnrolledEndUser[];
  allClasses: Classroom[] = [];
  allPlatforms: string[] = [];
  allCourses: Bot[] = [];

  allStatus = [
    EnrolledEndUserStatus.Inactive,
    EnrolledEndUserStatus.Active,
    EnrolledEndUserStatus.Stuck
  ];

  selectedClass = 'allClasses';
  selectedCourse = 'allCourses';
  selectedPlatform = 'allPlatforms';
  selectedStatus = 'allStatus';

  surveyId: string;
  templateId: string;
  selectedTime: Date;
  activeMessageId: string;

  scheduleMessageOptions: {schedule: ScheduledMessage, template: TemplateMessage};
  templateMessage: TemplateMessage;

  channel: CommunicationChannel;

  constructor(
    private _channelService: CommunicationChannelService,
    private _eLearners: EnrolledLearnersService,
    private _classroomServ$: ClassroomService,
    private _liveAnnouncer: LiveAnnouncer,
    private _botServ$: BotsStateService,
    private _dialog: MatDialog,
    private _messageService: MessageTemplatesService,
    private _scheduleMessageService: ScheduleMessageService,
    private _route$$: Router,
    private _activeTemplate$: ActiveMessageTemplateStore,
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
      this.allLearners = alllearners;
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
    return "Active";
  }

  getIcon(status: number) {
    return `/assets/svgs/learners/${this.getStatus(status)}.svg`
  }

  searchTable(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
  }

  filterTable(event: Event, mode:string) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (mode) {
      case 'class':
        this.selectedClass = selectedValue;
        break
      case 'course':
        this.selectedCourse = selectedValue;
        break
      case 'status':
        this.selectedStatus = selectedValue;
        break
      case 'platform':
        this.selectedPlatform = selectedValue;
        break
    }

    this.filterLearners()
  }

  filterLearners() {
    let filteredLearners = [...this.allLearners];
  
    if (this.selectedClass !== 'allClasses') {
      filteredLearners = filterLearnersByClass(filteredLearners, this.selectedClass);
    }
    if (this.selectedCourse !== 'allCourses') {
      filteredLearners = filterLearnersByCourse(filteredLearners, this.selectedCourse);
    }
    if (this.selectedStatus !== 'allStatus') {
      filteredLearners = filterLearnersByStatus(filteredLearners, this.selectedStatus);
    }
    if (this.selectedPlatform !== 'allPlatforms') {
      filteredLearners = filterLearnersByPlatform(filteredLearners, this.selectedPlatform);
    }

    this.dataSource.data = filteredLearners;
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

  getLearnersCourse(learner: EnrolledEndUser) {
    if (!learner.courses || !learner.courses.length) return "";

    return learner.courses[0].courseName;
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

  openChangeClassModal(event: Event) {
    event.stopPropagation();

    this._dialog.open(ChangeClassComponent, {
      data: { enrolledUsrs: this.selection.selected },
      width: '400px',
    });

    this._dialog.afterAllClosed.subscribe(() => this.selection.clear())
  }

  openCreateClassModal() {
    this._dialog.open(CreateClassModalComponent, {
      width: '400px',
    });
  }

  getScheduleOptions(){

    this._scheduleMessageService.optionsSet$.pipe(tap((opt)=> {
      if(!opt) this.getTemplate();
    })).subscribe((options)=> {
       if(options && options.template) {
        this.scheduleMessageOptions = options;
        // TODO: Remove this redundancy
        this.templateMessage = options.template;
        this.activeMessageId = options.template.id as string
        this.selectedTime = options.schedule.dispatchTime as Date;
      }
    })
  }

  getTemplate() {
    this._sBs.sink = this._activeTemplate$.get().subscribe((template)=> {
     this.templateMessage = template;
     })
   }

  sendMessageButtonClicked() {
    if(this.scheduleMessageOptions) {
      
      const action = this.scheduleMessageOptions.schedule.scheduleOption;
      
      switch (action) {
        case ScheduleOptionType.SpecificTime:
          this.scheduleMessage();
          break;
        case ScheduleOptionType.Inactivity:
          this.scheduleInactivity();
          break;
        default:
          alert('No message configuration found!')
          break;
        }

      } else this.sendMessageNow();
  }
        
        
  sendMessageNow() {
    const selectedUsers = this.selection.selected;
    const schedule: ScheduledMessage = {
      id: `direct_${Date.now()}`, 
      channelId: this.templateMessage.channelId as string,
      objectID: this.templateMessage.id,
      dispatchTime: new Date(),
      scheduleOption: ScheduleOptionType.SpecificTime,
    }

    const scheduleRequest = {
      ...schedule,
      message: this.templateMessage,
      enrolledEndUsers: selectedUsers.map((user)=> user.id),
    };

    
    this._sBs.sink = this._scheduleMessageService.scheduleMessage(scheduleRequest).subscribe((resp)=> {
      if(resp) {
        // TODO: Display Toast Message based on Response
        this.openTemplate(this.templateMessage.id as string);
      }
    });
  }

  scheduleMessage() {
    const selectedUsers = this.selection.selected;
    const scheduleRequest = {
      ...this.scheduleMessageOptions.schedule,
      message: this.templateMessage,
      enrolledEndUsers: selectedUsers.map((user)=> user.id),
    };
    
    this._sBs.sink = this._scheduleMessageService.scheduleMessage(scheduleRequest).subscribe((resp)=> {
      if(resp) {
        // TODO: Display Toast Message based on Response
        this.openTemplate(this.templateMessage.id as string);
      }
    });
  }
  
  scheduleInactivity() {
    const inactivityRequest = {
      ...this.scheduleMessageOptions.schedule,
      message: this.templateMessage
    };
  
    this._sBs.sink = this._scheduleMessageService.scheduleInactivity(inactivityRequest).subscribe((resp)=> {
      if(resp) {
        // TODO: Display Toast Message based on Response
        this.openTemplate(this.templateMessage.id as string);
      }
    });
  }

  openTemplate(id: string){
    this._route$$.navigate(['/messaging', id]);
  }
  
  sendMessageWithChannel(template: TemplateMessage, selectedUsers: EnrolledEndUser[]) {
    const channelId = template?.channelId || '';

    const payload = {
      template: template,
      type: MessageTypes.TEXT,
      templateType: TemplateMessageTypes.Text,
      enrolledEndUsers: [] as string[],
    };
  
    this._messageService.sendMessageTemplate(payload, channelId, selectedUsers).subscribe();
    
    this.openTemplate(template.id as string);
  }

  _getChannelDetails(channelId: string) {
    return this._channelService.getSpecificChannel(channelId);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}