import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { OptionGroupFormService } from '../../services/input-options-group-form.service';

import { FEFlowOptionGroup } from '../../models/fe-flow-option-element.model';
import { buildV31CheckboxGroup } from '../../utils/build-checkbox-group.util';
import { ChangeTrackerService } from '@app/state/convs-mgr/wflows';

@Component({
  selector: 'lib-flow-checkbox-options',
  templateUrl: './flow-checkbox-options.component.html',
  styleUrl: './flow-checkbox-options.component.scss',
})
export class FlowCheckboxOptionsComponent implements OnInit
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

  constructor(private optionGroupFormService: OptionGroupFormService,
              private fb: FormBuilder,
              private _trackerService: ChangeTrackerService
  ) {}

  ngOnInit(): void {
    if (this.flowGroup) {
      this.checkboxGroupForm = this.optionGroupFormService.createRadioGroupForm(this.flowGroup);
    } else {
      this.checkboxGroupForm = this.optionGroupFormService.createEmptyRadioGpForm();
    }
    this.checkboxGroupForm.valueChanges.subscribe((value) => {
      console.log(value);
      this.saveRadioConfig();
    })
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

      console.log('Saved Radio Config:', metaRGroup);
      // this.showConfigs = false;
      this._trackerService.updateValue(this.control.id, metaRGroup);
      
    } else {
      console.error('Form is invalid');
    }
  }

}
