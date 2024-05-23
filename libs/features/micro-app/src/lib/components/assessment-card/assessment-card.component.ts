import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { AssessmentQuestion } from '../../models/assessment-question.interface';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card.component.html',
  styleUrls: ['./assessment-card.component.scss']
})
export class AssessmentCardComponent implements OnInit {
  @Input() assessmentQuestions: AssessmentQuestion[];
  @Input() assessmentFormArray: FormArray;

  @Input() assessmentForm: FormGroup

  constructor(){}

  ngOnInit(): void {
      console.log(this.assessmentFormArray)
  }
}
