import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable, take } from 'rxjs';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { Bot } from '@app/model/convs-mgr/bots';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { GroupProgressModel, Periodicals } from '@app/model/analytics/group-based/progress';
import { ProgressMonitoringService, ProgressMonitoringState } from '@app/state/convs-mgr/monitoring';

import { AllClassroom, AllCourse } from '../../utils/mock.data';
import { getDateRange, getPeriodFromRange } from '../../utils/analytics.utils';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  courses$: Observable<Bot[]>;
  classrooms$: Observable<Classroom[]>;
  botModules$: Observable<BotModule[]>;

  progress$: Observable<{scopedProgress: GroupProgressModel[], allProgress: GroupProgressModel[]}>;
  period$: Observable<Periodicals>;
  isLast$: Observable<boolean>;
  isFirst$: Observable<boolean>;

  analyticsStartDate: Date;

  todaysDate = new Date();

  customPeriodForm: FormGroup;

  periodical: Periodicals = 'Weekly';

  allCourse = AllCourse; // so i can access this in the template
  allClass = AllClassroom // so i can access this in the template

  activeCourse = this.allCourse;
  activeClassroom = this.allClass;

  loading = true;
  latestProgressData: GroupProgressModel;

  private _state$$: ProgressMonitoringState;

  constructor(
    private _clasroomServ$: ClassroomService,
    private _botModServ$: BotModulesStateService,
    private _botServ$: BotsStateService,
    private _progressService: ProgressMonitoringService
  ) { 
    this._state$$ = _progressService.getProgressState();
  }
  
  
  ngOnInit() {
    this.progress$ = this._state$$.getProgress();
    
    this.period$ = this._state$$.getPeriod();

    this.isLast$ = this._state$$.isLast();
    this.isFirst$ = this._state$$.isFirst();

    this._state$$.getAnalyticsStartDate()
      .pipe(take(1))
        .subscribe((startDate)=> {
          this.analyticsStartDate = startDate.toDate();
        }); 

    this.initStateDataLayer();

    this.initCustomPeriodForm();

    this.handleCustomRange();
  }

  initCustomPeriodForm() {
    this.customPeriodForm = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
  }
  
  initStateDataLayer() {
    this.courses$ = this._botServ$.getBots();
    this.classrooms$ = this._clasroomServ$.getAllClassrooms();
    this.botModules$ = this._botModServ$.getBotModules(); 
  }

  handleCustomRange() {
    this.customPeriodForm.get('end')?.valueChanges.subscribe((end)=> {
      if(end) {
        const dateRange = {
          start: this.customPeriodForm.value.start,
          end: end
        }

        this._state$$.customSelectedDate = dateRange;

        this._state$$.isCustom = true;

        const period = getPeriodFromRange(dateRange);

        this._state$$.setPeriod(period);
        this.periodical = 'Custom';
      }
    })

  }

  selectActiveCourse(course: Bot) {
    this.activeCourse = course;
  }

  move(direction: 'past' | 'future') 
  {
    this._state$$.nextPage(direction);
  }

  selectActiveClassroom(classroom: Classroom) {
    this.activeClassroom = classroom;
  }

  selectProgressTracking(trackBy: Periodicals) {
    this._state$$.isCustom = false;

    this.customPeriodForm.reset();
    // Resets the page number
    //  Each period has different page numbers, so we reset the page
    //    number so that the user can start from the current date data
    this._state$$.resetPage();

    this._state$$.setPeriod(trackBy);
    this.periodical = trackBy;
  }

  getDateRange(period: Periodicals | null) {
    if(this._state$$.dateRange) {
      return getDateRange(period, this._state$$.dateRange);
    };
    return null;
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
