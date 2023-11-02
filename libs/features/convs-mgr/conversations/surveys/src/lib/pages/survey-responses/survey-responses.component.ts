import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-responses',
  templateUrl: './survey-responses.component.html',
  styleUrls: ['./survey-responses.component.scss'],
})
export class SurveyResponsesComponent {
  constructor(private _route$$: Router) {}

  goToTemplates() {
    this._route$$.navigate(['messaging']);
  }
}
