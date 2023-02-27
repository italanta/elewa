import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-open-ended-question-edit',
  templateUrl: './open-ended-question-edit.component.html',
  styleUrls: ['./open-ended-question-edit.component.scss'],
})
export class OpenEndedQuestionEditComponent {
  @Input() form:FormGroup;
  @Input() title: string;
}
