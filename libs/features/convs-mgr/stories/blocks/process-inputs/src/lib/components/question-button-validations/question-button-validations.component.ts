import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-question-button-validations',
  templateUrl: './question-button-validations.component.html',
  styleUrls: ['./question-button-validations.component.scss'],
})
export class QuestionButtonValidationsComponent {
  @Input() variablesForm: FormGroup;
}
