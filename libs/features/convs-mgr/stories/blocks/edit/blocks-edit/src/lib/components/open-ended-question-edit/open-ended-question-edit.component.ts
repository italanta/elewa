import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-open-ended-question-edit',
  templateUrl: './open-ended-question-edit.component.html',
  styleUrls: ['./open-ended-question-edit.component.scss'],
})
export class OpenEndedQuestionEditComponent implements OnInit {
  @Input() form:FormGroup;
  @Input() title: string;
  validate: boolean;

  ngOnInit() {
    this.validate = this.form.value.variable.validate;
  }

  setValidation() {
    this.validate = !this.validate;
  }
}