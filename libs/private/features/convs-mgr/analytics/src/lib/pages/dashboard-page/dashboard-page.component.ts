import { Component, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { Bot } from '@app/model/convs-mgr/bots';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Periodicals } from '@app/model/analytics/group-based/progress';

import { AllClassroom, AllCourse } from '../../utils/mock.data';

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

  topStats = [{count: 7, text: "Courses Published", color: "#05668D", icon: "check-all.svg"},
              {count: 12, text: "Courses UnPublished", color: "#392F5A", icon: "camera-timer.svg"},
              {count: 4, text: "Courses Started", color: "#404E4D", icon: "book-multiple-outline.svg"},
              {count: 3, text: "Courses Completed", color: "#69306D", icon: "book-check-outline.svg"}]


  periodical: Periodicals = 'Weekly';

  allCourse = AllCourse; // so i can access this in the template
  allClass = AllClassroom // so i can access this in the template

  activeCourse = this.allCourse;
  activeClassroom = this.allClass;

  loading = true;

  constructor(
    private _clasroomServ$: ClassroomService,
    private _botModServ$: BotModulesStateService,
    private _botServ$: BotsStateService
  ) {}

  ngOnInit() {
    this.initStateDataLayer();
  }

  initStateDataLayer() {
    this.courses$ = this._botServ$.getBots();
    this.classrooms$ = this._clasroomServ$.getAllClassrooms();
    this.botModules$ = this._botModServ$.getBotModules();
  }

  selectActiveCourse(course: Bot) {
    this.activeCourse = course;
  }

  selectActiveClassroom(classroom: Classroom) {
    this.activeClassroom = classroom;
  }

  selectProgressTracking(trackBy: Periodicals) {
    this.periodical = trackBy;
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
