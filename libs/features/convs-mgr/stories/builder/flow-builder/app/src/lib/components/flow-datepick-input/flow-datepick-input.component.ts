import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs';

import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl, FlowControlType, FlowDatePickerInput, FlowPageLayoutElementTypesV31, FlowTextAreaInput, FlowTextInput } from '@app/model/convs-mgr/stories/flows';

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

  constructor(private trackerService: ChangeTrackerService ) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;

    this.textInputForm.valueChanges
    .pipe(debounceTime(10000))  //10 seconds
      .subscribe(value=> {
      this.triggerAutosave(value);
    });
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
      this.element = metaDateInput
      this.showConfigs = false;  
      this.triggerAutosave(metaDateInput);
    }
  } 

   /** Trigger autosave servie */
   private triggerAutosave(newValue: FlowDatePickerInput): void {
    this.trackerService.updateValue(newValue);
  }

}