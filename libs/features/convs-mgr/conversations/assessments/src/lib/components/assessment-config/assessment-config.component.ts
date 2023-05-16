import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Assessment, FeedbackType } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'convl-italanta-apps-assessment-config',
  templateUrl: './assessment-config.component.html',
  styleUrls: ['./assessment-config.component.scss'],
})
export class AssessmentConfigComponent {
  @Input() assessment: Assessment;
  @Input() assessmentMode: number
  config: FormGroup;

  immediateFeedback = FeedbackType.Immediately;
  onEndFeedback = FeedbackType.OnEnd;
  noFeedback = FeedbackType.Never;

  constructor(private _formBuilder: FormBuilder){}

  ngOnInit(){
    this.createFormGroup();

    if(!this.assessmentMode){
      this.updateFormGroup();
    }
  }

  createFormGroup(){
    this.config = this._formBuilder.group({
      feedback: [''],
      userAttempts: ['']
    })
  }

  updateFormGroup(){
    this.config.patchValue({
      feedback: this.assessment.configs?.feedback,
      userAttempts: this.assessment.configs?.userAttempts
    })
  }
}
