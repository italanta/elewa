import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.scss'],
})
export class VariableInputComponent implements OnInit {
  @Input() blockType: StoryBlockTypes;
  variableForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    const variable = this.getVariableName();

    this.variableForm = this._fb.group({
      variable,
      validationMessage:
        "I'm afraid I didn't understand, could you try again, please?⁠",
    });
  }

  getVariableName() {
    switch (this.blockType) {
      case StoryBlockTypes.Name:
        return 'name';
      case StoryBlockTypes.Email:
        return 'email';
      case StoryBlockTypes.PhoneNumber:
        return 'number';
      default:
        return '';
    }
  }

  createValues() {
    console.log(this.variableForm);
    console.log(this.variableForm.value.variable);
  }
}
