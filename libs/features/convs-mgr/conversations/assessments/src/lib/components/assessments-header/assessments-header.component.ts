import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateAssessmentModalComponent } from '../../modals/create-assessment-modal/create-assessment-modal.component';

@Component({
  selector: 'app-assessments-header',
  templateUrl: './assessments-header.component.html',
  styleUrls: ['./assessments-header.component.scss'],
})
export class AssessmentsHeaderComponent implements OnInit {

  constructor(private _dialog: MatDialog) {}

  ngOnInit(): void {}

  openCreateAssessmentDialog(){
    this._dialog.open(CreateAssessmentModalComponent);
  }
}
