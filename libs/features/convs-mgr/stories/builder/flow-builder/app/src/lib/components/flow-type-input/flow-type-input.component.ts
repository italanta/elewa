import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Subject } from 'rxjs';

import { ChangeTrackerService, FlowEditorStateProvider } from '@app/state/convs-mgr/wflows';
import { FlowDatePickerInput, FlowTextAreaInput, FlowTextInput } from '@app/model/convs-mgr/stories/flows';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { TextInputElementsService } from '../../services/text-inputs-elements.service';
import { FeTextInput } from '../../models/text-type-elements.model';


@Component({
  selector: 'app-flow-type-input',
  templateUrl: './flow-type-input.component.html',
  styleUrl: './flow-type-input.component.scss',
})
export class FlowTypeInputComponent implements OnInit 
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
  private autosaveSubject = new Subject<any>();

  private _sbS = new SubSink ()

  constructor(private trackerService: ChangeTrackerService,
              private _formService: TextInputElementsService
) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;

    this.buildForms()
  }

  buildForms(element?: FeTextInput): void {
    this.textInputForm = element
      ? this._formService.buildTextForm(element)
      : this._formService.buildEmptyTextForm();

    // Autosave on form value changes
    this._sbS.sink = this.textInputForm.valueChanges.subscribe((formValue) => {
      this.autosaveSubject.next(formValue);
    });
  }
  
  saveInputConfig(): void {
    if (this.textInputForm.valid) {
      this.element = this.textInputForm.value;  // Capture form values
      this.showConfigs = false;  // Hide configuration form
      this.triggerAutosave(this.element)
    }
  }

  /** Trigger autosave */
  private triggerAutosave(newValue: any): void {
    this.trackerService.updateValue(this.control.id, newValue);
  }
}
