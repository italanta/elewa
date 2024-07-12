import { Component, Input} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MicroAppAssessmentQuestion } from '@app/model/convs-mgr/micro-app/base';

import { AppViewService } from '../../services/content-view-mode.service';
import { PageViewMode } from '../../model/view-mode.enum';
import { SetAssessmentScoreService } from '../../services/set-pass-status.service';

@Component({
  selector: 'app-all-questions-form',
  templateUrl: './all-questions-form.component.html',
  styleUrl: './all-questions-form.component.scss'
})
export class AllQuestionsFormComponent
{
  /** Array of all questions in an assessment */
  @Input() assessmentQuestions: MicroAppAssessmentQuestion[];
  /** Asssessments form group */
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;

  showFeedback = false

  constructor( private _pageViewServ: AppViewService,
               private _assessmentScoreServ: SetAssessmentScoreService
  ){}

  /** Logic to handle submitting an assessment
   *  //TODO: Add logic to actually submit an assessment
   */
  handleSubmit()
  {
   this._pageViewServ.setPageViewMode(PageViewMode.FailFeedbackMode)
  }
  
}
