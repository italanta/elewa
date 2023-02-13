import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

@Component({
  selector: 'app-question-buttons-edit-forms',
  templateUrl: './question-buttons-edit-forms.component.html',
  styleUrls: ['./question-buttons-edit-forms.component.scss'],
})
export class QuestionButtonsEditFormsComponent implements OnInit {
  @Input() form: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    console.log(this.form);
  }

  get options(): FormArray {
    return this.form.controls['options'] as FormArray;
  }

  addQuestionOptions(option?: ButtonsBlockButton<any>) {
    return this._fb.group({
      id: [option?.id ?? `${this.form.value.id}-${this.options.length + 1}`],
      message: [option?.message ?? ''],
      value: [option?.value ?? ''],
    });
  }

  addNewOption() {
    this.options.push(this.addQuestionOptions());
  }

  deleteInput(i: number) {
    this.options.removeAt(i);
  }
}
