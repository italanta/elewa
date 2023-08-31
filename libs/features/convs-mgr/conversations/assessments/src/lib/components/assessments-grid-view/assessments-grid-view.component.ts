import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { DeleteAssessmentModalComponent } from '../../modals/delete-assessment-modal/delete-assessment-modal.component';

@Component({
  selector: 'app-assessments-grid-view',
  templateUrl: './assessments-grid-view.component.html',
  styleUrls: ['./assessments-grid-view.component.scss'],
})
export class AssessmentsGridViewComponent implements OnInit {

  @Input() dataSource: MatTableDataSource<Assessment>;
  @Input() assessments: Assessment[];

  constructor(private _router: Router,
              private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openAssessment(assessmentId: string) {
    this._router.navigate(['/assessments', assessmentId]);
  }

  openAssessmentResults(assessmentId: string) {
    this._router.navigate(['/assessments', assessmentId, 'results']);
  }

  openDeleteModal(assessment: Assessment) {
    this._dialog.open(DeleteAssessmentModalComponent, {
      data: { assessment },
      panelClass: 'delete-assessment-container',
    });
  }
}
