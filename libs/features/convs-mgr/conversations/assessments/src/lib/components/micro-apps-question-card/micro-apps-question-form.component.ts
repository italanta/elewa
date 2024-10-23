import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-micro-apps-question-form',
  templateUrl: './micro-apps-question-form.component.html',
  styleUrl: './micro-apps-question-form.component.scss',
})
export class MicroAppsQuestionFormComponent
{
    @Input() question!: FormGroup;
    @Input() i!: number;
    @Input() currentStep!: number | null;  // Pass null for long form
    @Input() stepView = false;
  
    showQuestion(index: number): boolean {
      return !this.stepView || (this.stepView && index === this.currentStep);
    }
}
