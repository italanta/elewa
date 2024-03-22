import { AfterViewInit, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { startWith, tap } from 'rxjs';

import { SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

@Component({
  selector: 'app-survey-view',
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.scss'],
})
export class SurveyViewComponent implements AfterViewInit {

  @Input() surveyForm: FormGroup;
  @Input() questions: SurveyQuestion[];

  surveyPreviewData: any = {};

  ngAfterViewInit(): void {
    this.surveyForm.valueChanges
                .pipe(startWith(this.surveyForm.value),
                      tap(() => this.surveyPreviewData = this.surveyForm.value))
                .subscribe();
  }
}
