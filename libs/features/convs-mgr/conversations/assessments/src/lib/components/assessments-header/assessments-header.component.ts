import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItalBreadCrumb } from '@app/model/layout/ital-breadcrumb';

@Component({
  selector: 'app-assessments-header',
  templateUrl: './assessments-header.component.html',
  styleUrls: ['./assessments-header.component.scss'],
})
export class AssessmentsHeaderComponent {

  breadcrumb={ icon: 'assets/icons/bot.png', paths: [{ label: 'Home', link: '' }, { label: 'Assessments', link: '' }] } as ItalBreadCrumb

  constructor(private _router$$: Router) {}

  // ngOnInit(): void {}

  createAssessment(){
   this._router$$.navigate(['assessments', 'create']);
  }
}
