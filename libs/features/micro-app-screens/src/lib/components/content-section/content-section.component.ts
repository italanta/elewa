import { Component, OnInit } from '@angular/core';
import { TEST_DATA } from '../../utils/test-data';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit {

  assessmentQuestions = TEST_DATA

  assessmentFormArray: FormArray;

  assessmentForm: FormGroup

  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _fb: FormBuilder,
  ){}

  ngOnInit() {
    this.buildForms()
  }

  /**Building assessment forms */
  buildForms(){
    this.assessmentFormArray = this._assessFormService.createMicroAppAssessment(this.assessmentQuestions);
    this.assessmentForm = this._fb.group({
      assessmentFormArray: this.assessmentFormArray
    });
  }
}
