import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControlType, FlowControl } from '@app/model/convs-mgr/stories/flows';

import { OptionGroupFormService } from '../../services/input-options-group-form.service';
import { __buildV31RadioGroup } from '../../utils/build-radio-options-group.util';
import { FEFlowOptionGroup } from '../../models/fe-flow-option-element.model';

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
  /** Pass in the radio group */
  flowGroup?: FEFlowOptionGroup; 
  radioGroupForm: FormGroup;
 
  /** Toggle view state */
  showConfigs = true;

  constructor(private radioOptionGroupFormService: OptionGroupFormService,
              private fb: FormBuilder,
              private _trackerService: ChangeTrackerService

  ) {}

  ngOnInit(): void {
    //TODO: Get the saved flows and assign them to flowGroup so as to build forms
    this.radioGroupForm = this.radioOptionGroupFormService.createRadioGroupForm(this.flowGroup)
  }

  /** Options controls */
  get options() {
    return this.radioGroupForm.get('options') as FormArray;
  }

  /** Adding another option */
  addOption() {
    const optionGroup = this.fb.group({
      optionId:[ Math.random().toString()] ,
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
      this.showConfigs = false;
      this.flowGroup = this.radioGroupForm.value;
      const metaRGroup = __buildV31RadioGroup(this.radioGroupForm.value);
      this._trackerService.updateValue(this.control.id, metaRGroup)
      
    } else {
      console.log('Form is invalid');
    }
  }
}
