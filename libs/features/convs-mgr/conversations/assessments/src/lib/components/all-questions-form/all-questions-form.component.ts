import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { getMediaType } from '../../utils/check-media-type.util';

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

  /** Get media type for the current question */
  getMediaTypeForQuestion(mediaPath: string): 'image' | 'video' {
    return getMediaType(mediaPath) as 'image' | 'video';
  }
}
