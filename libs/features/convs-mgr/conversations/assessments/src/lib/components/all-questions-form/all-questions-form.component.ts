import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-all-questions-form',
  templateUrl: './all-questions-form.component.html',
  styleUrl: './all-questions-form.component.scss'
})
export class AllQuestionsFormComponent{
  /** Asssessments form group */
  @Input() assessmentForm: FormGroup;
  /** Form array for when form view is single question */
  @Input() assessmentFormArray: FormArray;


  getQuestion(i: number): FormGroup {
    return this.assessmentFormArray.at(i) as FormGroup;
  }
}
