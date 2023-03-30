import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { map } from 'rxjs';
import { SubSink } from 'subsink';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ProcessInputService } from '../../providers/process-input.service';
import { _CreateNameBlockVariableForm } from '../../model/name-variables-form.model';
import { variableCreateFn } from '../../model/shared-types.model';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.scss'],
})
export class VariableInputComponent implements OnInit, OnDestroy {
  @Input() validate: boolean;
  @Input() BlockFormGroup: FormGroup;
  private _sub = new SubSink();

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

    const { variableName, formCreator } = this.getFormCreationDetails(
      this.blockType
    );

    this.variablesForm = formCreator(
      this._fb,
      this.BlockFormGroup,
      variableName
    );
  }

  get name() {
    return this.variablesForm.controls['name'];
  }

  /**
   * Retrieves the variable form creation details for a given StoryBlockTypes.
   *
   * @param {StoryBlockTypes} blockType The type of the StoryBlock.
   * @returns {{ variableName: string; formCreator: variableCreateFn }} The form creation details including the default variableName for the variable and the form creator function.
   *
   * The `variableName` parameter is the default name to prefill the form when the block is selected.
   * The `formCreator` parameter is the function to create the FormGroup depending on the StoryBlockTypes.
   */
  getFormCreationDetails(blockType: StoryBlockTypes): {
    variableName: string;
    formCreator: variableCreateFn;
  } {
    switch (blockType) {
      case StoryBlockTypes.Name:
        return {
          variableName: 'name',
          formCreator: _CreateNameBlockVariableForm,
        };
      default:
        return { variableName: '', formCreator: _CreateNameBlockVariableForm };
    }
  }

  /**
   * Sets a variable in the block form based on the user's input and validates that the variable name is not already used.
   *
   * @returns {void}
   */
  setVariable(): void {
    const variableName = this.variablesForm.get('name')?.value;

    this._sub.sink = this._processInputSer.blocksWithVars$
      .pipe(
        map((blocks) => {
          const isPresent = blocks.find(
            (block) =>
              block.variable?.name === variableName && block.id !== this.blockId
          );

          if (isPresent) {
            this.name.setErrors({ incorrect: 'name is already used' });
          } else {
            const variableData = {
              name: this.variablesForm.get('name')?.value,
              type: parseInt(this.variablesForm.get('type')?.value),
              validate: this.validate,
              validators: this.validate
                ? this.variablesForm.get('validators')?.value ?? {}
                : {},
            };

            this.BlockFormGroup.value.variable = variableData;
          }
        })
      )
      .subscribe();
  }

  onSubmit() {
    this.setVariable();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
