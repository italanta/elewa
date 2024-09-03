import { Component, inject, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { debounceTime, Subject } from 'rxjs';

import { ChangeTrackerService } from '@app/state/convs-mgr/wflows';
import { FlowDatePickerInput, FlowTextAreaInput, FlowTextInput } from '@app/model/convs-mgr/stories/flows';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { TextInputElementsService } from '../../services/text-inputs-elements.service';
import { FeTextInput } from '../../models/text-type-elements.model';

@Component({
  selector: 'lib-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrl: './text-area-input.component.scss',
})
export class TextAreaInputComponent 
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
    // Setup autosave with debounce
    this.autosaveSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.triggerAutosave(value);
    });
  }

  buildForms(element?: FeTextInput): void {
    this.textInputForm = element
      ? this._formService.buildTextAreaForm(element)
      : this._formService.buildEmptyTextAreaForm();
  }
  
  /** Trigger autosave */
  private triggerAutosave(newValue: any): void {
    this.trackerService.updateValue(this.control.id, newValue);
  }

  saveInputConfig(): void {
    if (this.textInputForm.valid) {
      this.element = this.textInputForm.value;  // Capture form values
      this.showConfigs = false;  // Hide configuration form
      //TODO: COnvert to  meta json format before sending to service
      // All text inputs should be part of a form
      this.triggerAutosave(this.element)
    }
  }
}
