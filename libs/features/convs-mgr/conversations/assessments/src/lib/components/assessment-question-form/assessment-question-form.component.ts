import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { DeleteAssessmentModalComponent } from '../../modals/delete-bot-modal/delete-assessment-modal.component';

@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './assessment-question-form.component.html',
  styleUrls: ['./assessment-question-form.component.scss'],
})
export class AssessmentQuestionFormComponent {
  @Input() questions: AssessmentQuestion[];
  @Input() questionNo: number;

  @Input() assessmentMode: number;
  
  @Input() assessmentFormGroup: FormGroup;
  @Input() questionFormGroupName: number | string;

  constructor(private _dialog: MatDialog){}

  get questionFormGroup(){
    const questionsFormArray = this.assessmentFormGroup.get('questions') as FormArray;
    return questionsFormArray.controls[this.questionFormGroupName as number] as FormGroup;
  }

  openDeleteModal() {
    const id = this.questionFormGroup.value.id;
    const question = this.questions.find(question => question.id = id) as AssessmentQuestion

    this._dialog.open(DeleteAssessmentModalComponent, {
      data: { question },
      panelClass: 'delete-dialog-container'
    });
  }
}
