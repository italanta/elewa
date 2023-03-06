import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { VariablesConfigService } from '@app/state/convs-mgr/stories/variables-config';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { _CreateNameBlockVariableForm } from '../../model/name-variables-form.model';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.scss'],
})
export class VariableInputComponent implements OnInit {
  @Input() setValidation: boolean;
  @Input() BlockFormGroup: FormGroup;
  
  blockType: StoryBlockTypes;
  variablesForm: FormGroup;
  variablesTypesList = [
    { name: VariableTypes[1], value: 1 },
    { name: VariableTypes[2], value: 2 },
    { name: VariableTypes[3], value: 3 },
    { name: VariableTypes[4], value: 4 },
  ];

  nametype = StoryBlockTypes.Name;
  emailtype = StoryBlockTypes.Email;
  phonetype = StoryBlockTypes.PhoneNumber;

  constructor(
    private _fb: FormBuilder,
    private _variableService: VariablesConfigService
  ) {}

  ngOnInit(): void {
    this.blockType = this.BlockFormGroup.value.type;
    
    const variable = this.getVariableName(this.blockType);
    this.variablesForm = _CreateNameBlockVariableForm(
      this._fb,
      this.BlockFormGroup,
      variable
    );
  }

  getVariableName(blockType: StoryBlockTypes) {
    switch (blockType) {
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

  /** pass properties to block's formGroup */
  setVariable() {
    this.BlockFormGroup.value.variable = {
      name: this.variablesForm.get('name')?.value,
      type: parseInt(this.variablesForm.get('type')?.value),
      validators: this.variablesForm.get('validators')?.value ?? {},
    };

    // update list of avalilable variables
    const variable = this.variablesForm.get('name')?.value
    
    if(variable) {
      // todo check in store for variable

    }
  }

  onSubmit() {
    this.setVariable();
    console.log(this.BlockFormGroup);
  }
}
