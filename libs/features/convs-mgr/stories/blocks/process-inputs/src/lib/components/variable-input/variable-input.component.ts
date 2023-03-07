import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { map } from 'rxjs';

import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { VariablesConfigService } from '@app/state/convs-mgr/stories/variables-config';
import {
  StoryBlockTypes,
  Variable,
} from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ProcessInputService } from '../../providers/process-input.service';
import { _CreateNameBlockVariableForm } from '../../model/name-variables-form.model';


@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.scss'],
  providers: [ProcessInputService],
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
    private _variableService: VariablesConfigService,
    private _blockStore$$: StoryBlocksStore
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

  checkIsPresent(setVar: Variable) {
    let isPresent;

    this._blockStore$$
      .get()
      .pipe(
        map((blocks) =>
          blocks.filter(
            (block) =>
              !block.deleted && block.type < 1000 && block.variable?.name !== ''
          )
        )
      )
      .subscribe((blocks) => {
        isPresent = blocks.find(
          (block) => block.variable?.name === setVar.name
        );
      });

    return isPresent;
  }

  /** pass properties to block's formGroup */
  setVariable() {
    const variable = this.variablesForm.get('name')?.value;

    if (variable) {
      const isPresent = this.checkIsPresent(variable);

      if (!isPresent) {
        this.BlockFormGroup.value.variable = {
          name: this.variablesForm.get('name')?.value,
          type: parseInt(this.variablesForm.get('type')?.value),
          validators: this.variablesForm.get('validators')?.value ?? {},
        };
      } else {
        this.variablesForm.controls['name'].setErrors({ incorrect: true });
      }
    }
  }

  onSubmit() {
    this.setVariable();
    console.log(this.BlockFormGroup);
  }
}
