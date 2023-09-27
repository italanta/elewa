import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-header',
  templateUrl: './survey-header.component.html',
  styleUrls: ['./survey-header.component.scss'],
})
export class SurveyHeaderComponent {
  constructor(private _router$$: Router) {}

  ngOnInit(): void {}

  createSurvey(){
   this._router$$.navigate(['surveys', 'create']);
  }
}
