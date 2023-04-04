import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { cloneDeep as __cloneDeep } from 'lodash';
import { map, of, switchMap } from 'rxjs';
import { SubSink } from 'subsink';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ProcessInputService } from '../../providers/process-input.service';

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

  constructor(private _processInputSer: ProcessInputService) {}

  ngOnInit(): void {
    this.blockId = this.BlockFormGroup.value.id;
    this.blockType = this.BlockFormGroup.value.type;

    // we create a copy of the formGroup so we can validate before setting the values on submit
    this.variablesForm = __cloneDeep(this.BlockFormGroup);
    this.validateForm();
  }

  get name() {
    return this.variablesForm.get('variable.name');
  }

  /**
   * - Validates the form by checking if the variable name is already used in other blocks.
   * - If the variable name is already used, the form control will be marked as invalid.
   */
  validateForm() {
    this._sub.sink = this.variablesForm.controls['variable'].valueChanges
      .pipe(
        switchMap((value) =>
          this._processInputSer.blocksWithVars$.pipe(
            map((blocks) => {
              const isPresent = blocks.find(
                (block) =>
                  block.variable?.name === value.name &&
                  block.id !== this.blockId
              );

              if (isPresent) {
                this.name?.setErrors({ incorrect: 'name is already used' });
              }
            })
          )
        )
      )
      .subscribe();
  }

  /**
   * - Updates the BlockFormGroup with the selected validation type and input value type.
   * - If validate is false, the variable validators will be reset to null.
   * - The `type` property of the variable will be converted to an integer.
   */
  onSubmit() {
    this.BlockFormGroup = this.variablesForm;
    this.BlockFormGroup.controls['variable'].value.validate = this.validate;

    if (!this.validate) {
      this.BlockFormGroup.get('variable.validators')?.reset();
    }

    const type = this.variablesForm.get('variable.type')?.value;
    this.BlockFormGroup.controls['variable'].value.type = parseInt(type);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
