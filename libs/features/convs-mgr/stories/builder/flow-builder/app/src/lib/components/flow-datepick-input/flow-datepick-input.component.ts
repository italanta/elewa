import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs';

import { ChangeTrackerService } from '@app/state/convs-mgr/wflows';
import { FlowDatePickerInput, FlowPageLayoutElementTypesV31, FlowTextAreaInput, FlowTextInput } from '@app/model/convs-mgr/stories/flows';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { TextInputElementsService } from '../../services/text-inputs-elements.service';
import { FeTextInput } from '../../models/text-type-elements.model';

@Component({
  selector: 'lib-flow-datepick-input',
  templateUrl: './flow-datepick-input.component.html',
  styleUrl: './flow-datepick-input.component.scss',
})
export class FlowDatepickInputComponent implements OnInit
{ 
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl

  /** Dynamic input id */
  inputId = '';
  /** Form fields for inputs */
  textInputForm: FormGroup;

  element: FlowTextInput | FlowDatePickerInput | FlowTextAreaInput
  showConfigs = true;

  /** View Container */
  vrc = inject(ViewContainerRef)

  private _sbS = new SubSink ()

  constructor(private trackerService: ChangeTrackerService,
              private _formService: TextInputElementsService
) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;
    this.buildForms()

    this.textInputForm.valueChanges
    .pipe(debounceTime(10000))  //10 seconds
      .subscribe(value=> {
      this.saveInputConfig(value);
    });
  }

  buildForms(element?: FeTextInput): void {
    this.textInputForm = element
      ? this._formService.buildDateForm(element)
      : this._formService.buildEmptyDateForm();
  }
  
  saveInputConfig(_values: FlowDatePickerInput): void {
    if (this.textInputForm.valid) {
    
      const metaDateInput: FlowDatePickerInput = {
        name: _values.name,
        label: _values.label,
        required: _values.required,
        "helper-text": _values['helper-text'] || '', 
        type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT,
      };
      this.showConfigs = false;  
      this.triggerAutosave(metaDateInput);
    }
  } 

   /** Trigger autosave servie */
   private triggerAutosave(newValue: FlowDatePickerInput): void {
    this.trackerService.updateValue(this.control.id, newValue);
  }

  toggleView()
  {
    this.showConfigs != this.showConfigs
  }
}