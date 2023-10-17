import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable, map } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';

import { StoryStateService } from '@app/state/convs-mgr/stories';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';

import { ActionSortingOptions } from '../../model/sorting.enum';

@Component({
  selector: 'italanta-apps-courses-view-all-page',
  templateUrl: './courses-view-all-page.component.html',
  styleUrls: ['./courses-view-all-page.component.scss'],
})
export class CoursesViewAllPageComponent implements OnInit {
  private _sbS = new SubSink();

  @Input() showAllCourses: boolean;

  courses$: Observable<
    {
      bot: Bot;
      modules$: Observable<
        {
          module: BotModule;
          stories$: Observable<Story[]>;
        }[]
      >;
    }[]
  >;

  sortCoursesBy = 'newest';

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

  searchTable(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = searchValue.trim();
    // this.dataFound = this.dataSource.filteredData.length > 0;
  }

  sortBy(event: Event) {
    const searchValue = (event.target as HTMLInputElement)
      .value as ActionSortingOptions;
    this.sortCoursesBy = searchValue;
  }

  filterStatusBy(event: Event) {
    const searchValue = (event.target as HTMLInputElement)
      .value as ActionSortingOptions;
    this.sortCoursesBy = searchValue;
  }

  goToDashboard() {
    this._router$.navigateByUrl('/bots/dashboard');
  }
}
