// import { Breadcrumb } from '@iote/bricks-angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadCrumbPath } from '@app/model/layout/ital-breadcrumb';
import { BreadcrumbService } from '@app/elements/layout/ital-bread-crumb';

@Component({
  selector: 'app-assessments-header',
  templateUrl:'./assessments-header.component.html',
  styleUrls: ['./assessments-header.component.scss'],
})
export class AssessmentsHeaderComponent {

  breadcrumbs$: Observable<BreadCrumbPath[]>


  breadcrumb:BreadCrumbPath[]=[
    { label: 'Bot', link: '' },
    { label: 'Home', link: '' },
    { label: 'Assessments', link: 'assessments' }
  ];

  constructor(private _router$$: Router,  private _breadCrumbServ: BreadcrumbService
    ) { 
    this.breadcrumbs$ = this._breadCrumbServ.breadcrumbs$;  }

  

  createAssessment() {
    this._router$$.navigate(['assessments', 'create']);
  }
}


