import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort ,Sort } from '@angular/material/sort';

import { SubSink } from 'subsink';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { EndUserService } from '@app/state/convs-mgr/end-users';

import { ActiveAssessmentStore } from '@app/state/convs-mgr/conversations/assessments';
import { AssessmentCursor } from '@app/model/convs-mgr/conversations/admin/system';
import { EndUserDetails } from '@app/state/convs-mgr/end-users';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss'],
})
export class AssessmentResultsComponent implements OnInit, OnDestroy {
  id: string;
  assessment: Assessment;
  assessmentCursor:AssessmentCursor | undefined;

  dataSource: MatTableDataSource<EndUserDetails>;
  assessmentResults = ['name', 'phone', 'startedOn', 'finishedOn', 'score', 'scoreCategory'];

  private _sBs = new SubSink();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _activeAssessment: ActiveAssessmentStore,
    private _endUserService: EndUserService
  ) {}

  @ViewChild(MatSort) set MatSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  ngOnInit() {
    this._sBs.sink = this._activeAssessment.get().subscribe((assess) => this.assessment = assess);
    this._sBs.sink = this._endUserService.getUserDetailsAndTheirCursor().subscribe((results) => {
      const data = this.filterData(results);
      this.dataSource = new MatTableDataSource(data);
    });
  }

  filterData(results: EndUserDetails[]) {
    const data = results.filter(user => {
      if (!user.cursor[0].assessmentStack) return false

      this.assessmentCursor = user.cursor[0].assessmentStack.find(assess => assess.assessmentId === this.assessment.id)

      if (this.assessmentCursor) return true
      else return false
    })

    return data
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
