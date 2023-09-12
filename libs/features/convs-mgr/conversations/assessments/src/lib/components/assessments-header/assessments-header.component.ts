import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessments-header',
  templateUrl: './assessments-header.component.html',
  styleUrls: ['./assessments-header.component.scss'],
})
export class AssessmentsHeaderComponent implements OnInit {

  constructor(private _router$$: Router) {}

  ngOnInit(): void {}

  createAssessment(){
   this._router$$.navigate(['assessments', 'create']);
  }
}
