import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';

import { TranslateService } from '@ngfi/multi-lang';
import { Observable } from 'rxjs';

import { Assessment} from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

import { CreateAssessmentModalComponent } from '../../modals/create-assessment-modal/create-assessment-modal.component';
import { AssessmentDataSource } from '../../data-source/assessment-data-source.class';


@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss'],
})
export class AssessmentListComponent implements OnInit{
  assessments$: Observable<Assessment[]>;

  assessmentsColumns = ['title', 'inProgress', 'responses', 'actions'];

  dataSource: AssessmentDataSource;

  dataFound = true;

  @ViewChild(MatSort) set matSort(sort: MatSort){
    this.dataSource.sort = sort;
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator){
    this.dataSource.paginator = paginator;
  }

  constructor(private _assessments: AssessmentService,
              private _dialog: MatDialog,
              private _liveAnnounce: LiveAnnouncer,
              private _translate: TranslateService,
              private _router: Router){}

  ngOnInit(): void {
    this.assessments$ = this._assessments.getAssessments$();
    this.dataSource = new AssessmentDataSource(this.assessments$);
  }

  goToQuestions(assessmentId: string){
    this._router.navigate(['/assessments', assessmentId, 'view']);
  }

  searchTable(event: Event){
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim();
    this.dataFound = (this.dataSource.filteredData.length > 0);
  }

  openCreateAssessmentDialog(){
    this._dialog.open(CreateAssessmentModalComponent);
  }

  // For assistive technology to be notified of table sorting changes
  onSortChange(sort: Sort){
    if(sort.direction == 'asc'){
      this._liveAnnounce.announce(this._translate.translate('ASSESSMENTS.ACCESSIBILITY.SORTED-ASC'));
    } else if(sort.direction == 'desc'){
      this._liveAnnounce.announce(this._translate.translate('ASSESSMENTS.ACCESSIBILITY.SORTED-DESC'));
    }
  }
}
