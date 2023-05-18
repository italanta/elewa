import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Assessment, FeedbackType } from '@app/model/convs-mgr/conversations/assessments';

@Component({
  selector: 'convl-italanta-apps-assessment-config',
  templateUrl: './assessment-config.component.html',
  styleUrls: ['./assessment-config.component.scss'],
})
export class AssessmentConfigComponent {
  @Input() assessment: Assessment;
  @Input() assessmentMode: number
  @Input() assessmentFormGroup: FormGroup;

  immediateFeedback = FeedbackType.Immediately;
  onEndFeedback = FeedbackType.OnEnd;
  noFeedback = FeedbackType.Never;

  constructor(){}

  ngOnInit(){}
}
