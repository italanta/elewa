import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { OptionGroupFormService } from '../../services/input-options-group-form.service';

import { FEFlowOptionGroup } from '../../models/fe-flow-option-element.model';
import { buildV31CheckboxGroup } from '../../utils/build-checkbox-group.util';
import { ChangeTrackerService } from '@app/state/convs-mgr/wflows';
import { SubSink } from 'subsink';

@Component({
  selector: 'lib-flow-checkbox-options',
  templateUrl: './flow-checkbox-options.component.html',
  styleUrl: './flow-checkbox-options.component.scss',
})
export class FlowCheckboxOptionsComponent implements OnInit, OnDestroy
{
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl
  /* Pass in the radio group */
  flowGroup?: FEFlowOptionGroup; 
  checkboxGroupForm: FormGroup;
  /** Toggle view state */
  showConfigs = true;

  private _sBS = new SubSink()

  constructor(private optionGroupFormService: OptionGroupFormService,
              private fb: FormBuilder,
              private _trackerService: ChangeTrackerService
  ) {}

  ngOnInit(): void {
    this.checkboxGroupForm = this.optionGroupFormService.createRadioGroupForm(this.flowGroup);
  }
  
  /** Options controls */
  get options() {
    return this.checkboxGroupForm.get('options') as FormArray;
  }

  /** Adding another option */
  addOption() {
    const optionGroup = this.fb.group({
      optionId: [Math.random().toString()],
      label: ['', Validators.required]
    });
    this.options.push(optionGroup);
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  /**
   * Gets form values
   * Returns a V31OptionsGroup object
   * Then sends the object to tracker service for saving in state
   */
  saveRadioConfig() {
    if (this.checkboxGroupForm.valid) {
      this.flowGroup = this.checkboxGroupForm.value;      
      const metaRGroup = buildV31CheckboxGroup(this.checkboxGroupForm.value)

      this.showConfigs = false;
      this._trackerService.updateValue(this.control.id, metaRGroup);
      
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy(): void {
      this._sBS.unsubscribe()
  }

}
