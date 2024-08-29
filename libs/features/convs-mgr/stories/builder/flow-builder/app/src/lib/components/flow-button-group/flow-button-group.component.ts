import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { RadioOptionGroupFormService } from '../../services/input-options-group-form.service';
import { buildV31RadioGroup } from '../../utils/build-radio-options-group.util';
import { FEFlowRadioGroup } from '../../models/fe-flow-radio-element.model';

@Component({
  selector: 'lib-flow-button-group',
  templateUrl: './flow-button-group.component.html',
  styleUrl: './flow-button-group.component.scss',
})
export class FlowButtonGroupComponent implements OnInit
{
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl
  flowGroup?: FEFlowRadioGroup; // Pass in the radio group
  radioGroupForm: FormGroup;
  savedRadioConfig: any;
  showConfigs = true;

  constructor(private radioOptionGroupFormService: RadioOptionGroupFormService,
              private fb: FormBuilder,

  ) {}

  ngOnInit(): void {
    if (this.flowGroup) {
      this.radioGroupForm = this.radioOptionGroupFormService.createRadioGroupForm(this.flowGroup);
    } else {
      this.radioGroupForm = this.radioOptionGroupFormService.createEmptyRadioGpForm();
    }
  }

  /** Options controls */
  get options() {
    return this.radioGroupForm.get('options') as FormArray;
  }

  /** Adding another option */
  addOption() {
    const optionGroup = this.fb.group({
      id: Math.random().toString(),
      label: ['', Validators.required]
    });
    this.options.push(optionGroup);
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  /**
   * Gets form values
   * Returns a V31RadioGroup object
   * Then sends the object to tracker service for saving in state
   */
  saveRadioConfig() {
    if (this.radioGroupForm.valid) {
      this.flowGroup = this.radioGroupForm.value;
      const metaRGroup = buildV31RadioGroup(this.radioGroupForm.value)
      console.log('Saved Radio Config:', metaRGroup);
      this.showConfigs = false
      
    } else {
      console.error('Form is invalid');
    }
  }
}
