import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ProcessInputService } from '../../providers/process-input.service';
import { _CreateNameBlockVariableForm } from '../../model/name-variables-form.model';
import { variableCreateFn } from '../../model/shared-types.model';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.scss'],
  providers: [ProcessInputService],
})
export class VariableInputComponent implements OnInit, OnDestroy {
  @Input() validate: boolean;
  @Input() BlockFormGroup: FormGroup;

  blockId: string;
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
    private _processInputSer: ProcessInputService
  ) {}

  ngOnInit(): void {
    this.blockId = this.BlockFormGroup.value.id;
    this.blockType = this.BlockFormGroup.value.type;

    const { name, formCreator } = this.getFormCreationDetails(this.blockType);
    this.variablesForm = formCreator(this._fb, this.BlockFormGroup, name);
  }

  get name() {
    return this.variablesForm.controls['name'];
  }

  /**
   * selects the details required to create a variables form group
   * @param blockType - type of the selected block.
   * @returns '{name, formcreatorFunction}' - details required to build the formgroup
   */
  getFormCreationDetails(blockType: StoryBlockTypes): {
    name: string;
    formCreator: variableCreateFn;
  } {
    switch (blockType) {
      case StoryBlockTypes.Name:
        return { name: 'name', formCreator: _CreateNameBlockVariableForm };
      case StoryBlockTypes.Email:
        return { name: 'email', formCreator: _CreateNameBlockVariableForm };
      case StoryBlockTypes.PhoneNumber:
        return { name: 'phone', formCreator: _CreateNameBlockVariableForm };
      default:
        return { name: '', formCreator: _CreateNameBlockVariableForm };
    }
  }

  /** check if name is already used and pass properties to block's formGroup */
  setVariable() {
    const variable = this.variablesForm.get('name')?.value;

    this._processInputSer.blocksWithVars$.subscribe((blocks) => {
      const isPresent = blocks.find(
        (block) =>
          block.variable?.name === variable && block.id !== this.blockId
      );

      if (isPresent) {
        this.name.setErrors({ incorrect: 'name is already used' });
      } else {
        this.BlockFormGroup.value.variable = {
          name: this.variablesForm.get('name')?.value,
          type: parseInt(this.variablesForm.get('type')?.value),
          validators: this.variablesForm.get('validators')?.value ?? {},
        };
      }
    });
  }

  onSubmit() {
    this.setVariable();
    console.log(this.BlockFormGroup);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    //
  }
}
