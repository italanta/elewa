import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessments-header',
  templateUrl: './assessments-header.component.html',
  styleUrls: ['./assessments-header.component.scss'],
})
export class AssessmentsHeaderComponent {
  constructor(private _router$$: Router) {}

  createAssessment() {
    this._router$$.navigate(['assessments', 'create']);
  }
}
