import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AppViewService } from '../../services/content-view-mode.service';
import { PageViewMode } from '../../model/view-mode.enum';

@Component({
  selector: 'app-all-questions-form',
  templateUrl: './all-questions-form.component.html',
  styleUrl: './all-questions-form.component.scss'
})
export class AllQuestionsFormComponent
{
  /** Array of all questions in an assessment */
  @Input() assessmentQuestions: AssessmentQuestion[];
  /** Asssessments form group */
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;

  constructor( private _pageViewServ: AppViewService){}
  
  /** Logic to handle submitting an assessment */
  handleSubmit()
  {
    this._pageViewServ.setPageViewMode(PageViewMode.FailFeedbackMode)

    //TODO: Add logic to actually submit an assessment
  }
}
