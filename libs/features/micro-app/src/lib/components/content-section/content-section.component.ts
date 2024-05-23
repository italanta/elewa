import { Component, OnInit } from '@angular/core';
import { TEST_DATA } from '../../utils/test-data';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MicroAppAssessmentQuestionFormService } from '../../services/microapp-assessment-questions-form.service';
import { calculateProgress } from '../../utils/calculate-progress.util';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit {

  assessmentQuestions = TEST_DATA

  assessmentFormArray: FormArray;

  assessmentForm: FormGroup;

  //How far a learner is in answering questions
  progressPercentage = 0;

  constructor ( private _assessFormService: MicroAppAssessmentQuestionFormService,
                private _fb: FormBuilder,
  ){}

  ngOnInit() {
    this.buildForms();
    this.assessmentFormArray.valueChanges.subscribe(()=> this.getProgress())
  }

  /**Building assessment forms */
  buildForms(){
    this.assessmentFormArray = this._assessFormService.createMicroAppAssessment(this.assessmentQuestions);
    this.assessmentForm = this._fb.group({
      assessmentFormArray: this.assessmentFormArray
    });
  }

  /** Tracking how far a learner is in their assignment  */
  getProgress(){
    this.progressPercentage = calculateProgress(this.assessmentFormArray.controls);
  }
  /** Get the color for the progress bar */
  getProgressColor(): string {
    return '#1F7A8C'; 
  }
}
