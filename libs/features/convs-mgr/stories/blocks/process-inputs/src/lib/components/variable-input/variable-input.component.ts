import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { cloneDeep as __cloneDeep } from 'lodash';
import { map, switchMap } from 'rxjs';
import { SubSink } from 'subsink';

import { StoryBlockTypes, StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';
import { VariableTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ProcessInputService } from '../../providers/process-input.service';
import { StoryBlockConnectionsStateModule } from '@app/state/convs-mgr/stories/block-connections';

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
  audiotype = StoryBlockTypes.AudioInput;
  emailtype = StoryBlockTypes.Email;
  phonetype = StoryBlockTypes.PhoneNumber;
  locationtype = StoryBlockTypes.LocationInputBlock;
  imagetype = StoryBlockTypes.ImageInput;
  listtype = StoryBlockTypes.List;

  constructor(private _processInputSer: ProcessInputService) {}

  ngOnInit(): void {
    this.blockId = this.BlockFormGroup.value.id;
    this.blockType = this.BlockFormGroup.value.type;

    /**
     * * we create a copy of the formGroup so we can validate before setting the values on submit.
     * * using the blocksFormGroup creates a very rare race condition where two variables can exist with the same name (if the user is warned that the variable is alredy used but still doesn't change the value) this is why we clone.
     */
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
        switchMap((value: StoryBlockVariable) =>
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
   * - Updates the BlockFormGroup with all the selected properties.
   * - If validate is false, the variable validators will be reset to null.
   */
  onSubmit() {
    // Patch variable values from the cloned variablesFrom to the BlocksFromGroup
    const form = this.BlockFormGroup.get('variable') as FormGroup;
    const name = this.variablesForm.get('variable.name')?.value;
    const type = this.variablesForm.get('variable.type')?.value;

    form.patchValue({ name, type: parseInt(type), validate: this.validate });

    // patch validators values to BlockFormGroup validators.
    const blockValidators = this.BlockFormGroup.get('variable.validators') as FormGroup;

    if (this.validate) {
      const regex = (this.variablesForm.get('variable.validators') as FormGroup).get('regex')?.value;
      const max = (this.variablesForm.get('variable.validators') as FormGroup).get('max')?.value;
      const min = (this.variablesForm.get('variable.validators') as FormGroup).get('min')?.value;
      const validationMessage = (this.variablesForm.get('variable.validators') as FormGroup).get('validationMessage')?.value;

      blockValidators.patchValue({ regex, max, min, validationMessage });
    } else {
      this.BlockFormGroup.get('variable.validators')?.reset();
    }
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
