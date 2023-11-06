import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable, map } from 'rxjs';

import { StoryStateService } from '@app/state/convs-mgr/stories';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { ActionSortingOptions } from '../../model/sorting.enum';
import { Course } from '../../model/courses.interface';

@Component({
  selector: 'italanta-apps-courses-view-all-page',
  templateUrl: './courses-view-all-page.component.html',
  styleUrls: ['./courses-view-all-page.component.scss'],
})
export class CoursesViewAllPageComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() showAllCourses: boolean;

  courses$: Observable<Course>;

  sortCoursesBy = 'newest';
  searchValue = '';

  dataFound = true;
  viewInListView = false;

  @Output() collapseAllCourses = new EventEmitter();

  constructor(
    private _botsServ$: BotsStateService,
    private _storiesStateServ$: StoryStateService,
    private _modulesStateServ$: BotModulesStateService,
    private _router$: Router
  ) {}

  ngOnInit(): void {
    this.courses$ = this.mapBotsModulesAndStories();
  }

  mapBotsModulesAndStories() {
    return this._botsServ$.getBots().pipe(
      map((bots) =>
        bots.map((bot) => {
          return {
            bot: bot,
            modules$: this.mapModulesToLessons(bot.modules),
          };
        })
      )
    );
  }

  mapModulesToLessons(modules: string[]) {
    return this._modulesStateServ$.getMultipleBotModules(modules).pipe(
      map((modules) =>
        modules.map((mod) => {
          return {
            module: mod,
            stories$: this._storiesStateServ$.getMultipleStories(mod.stories),
          };
        })
      )
    );
  }

  sortBy(event: Event) {
    const searchValue = (event.target as HTMLInputElement)
      .value as ActionSortingOptions;
    this.sortCoursesBy = searchValue;
  }

  filterStatusBy(event: Event) {
    // filter by status
  }

  goToDashboard() {
    this._router$.navigateByUrl('/bots/dashboard');
  }

  openViewAllPage() {
    this._router$.navigateByUrl('/bots/view-all')
  }
}
