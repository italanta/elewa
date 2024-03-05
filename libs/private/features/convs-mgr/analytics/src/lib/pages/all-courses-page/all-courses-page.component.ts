import { Component, Input, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable, combineLatest, tap } from 'rxjs';

import { GroupProgressModel, Periodicals } from '@app/model/analytics/group-based/progress';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ProgressMonitoringService } from '@app/state/convs-mgr/monitoring';

@Component({
  selector: 'app-all-courses-page',
  templateUrl: './all-courses-page.component.html',
  styleUrls: ['./all-courses-page.component.scss'],
})
export class AllCoursesPageComponent implements OnInit {
  @Input() periodical: Periodicals;

  @Input() progress$: Observable<GroupProgressModel[]>;
  @Input() period$: Observable<Periodicals>;

  _sBs = new SubSink();

  topStatsAllCourses: any[];

  constructor(private _botServ$: BotsStateService,
              private _progressMonitoring: ProgressMonitoringService) {}

  ngOnInit(): void {
    const bots$ = this._botServ$.getBots();

    const progress$ = this._progressMonitoring.getLatestProgress();

    this._sBs.sink = combineLatest([progress$, bots$]).pipe(tap(([progress, bots])=>{
      this.topStatsAllCourses = this._progressMonitoring.allCoursesTopStats(bots,progress);
    })).subscribe()
  }
}
