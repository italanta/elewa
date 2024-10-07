import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getMediaType } from '../../utils/check-media-type.util';

@Component({
  selector: 'app-micro-apps-question-form',
  templateUrl: './micro-apps-question-form.component.html',
  styleUrl: './micro-apps-question-form.component.scss',
})
export class MicroAppsQuestionFormComponent implements OnInit
{
    @Input() question!: FormGroup;
    @Input() i!: number;
    @Input() currentStep!: number | null;  // Pass null for long form
    @Input() stepView = false;
  
    /** Get media type for the current question */
    getMediaTypeForQuestion(mediaPath: string): 'image' | 'video' {
      return getMediaType(mediaPath) as 'image' | 'video';
    }

    showQuestion(index: number): boolean {
      return !this.stepView || (this.stepView && index === this.currentStep);
    }
  
    ngOnInit(){
      console.log(this.question.controls, 'value of question')
    }
}
