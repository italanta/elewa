import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs';

import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl, FlowControlType, FlowTextAreaInput } from '@app/model/convs-mgr/stories/flows';

@Component({
  selector: 'lib-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrl: './text-area-input.component.scss',
})
export class TextAreaInputComponent implements OnInit
{
  @Input() elementForm: FormGroup;
  /** The type of input, for text inputs */
  type: FlowControlType;
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl;

  /** Dynamic input id */
  inputId = '';
  /** Form fields for inputs */
  textInputForm: FormGroup;

  element: FlowTextAreaInput;
  showConfigs = true;

  /** View Container */
  vrc = inject(ViewContainerRef);

  private _sbS = new SubSink ();

  constructor(private trackerService: ChangeTrackerService) {}

  ngOnInit(): void 
  {
    this.inputId = `input-${this.type}`;
    this.textInputForm = this.elementForm;

    // Setup autosave with debounce
    this.textInputForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.triggerAutosave(value);
    });
  }
  
  /** Trigger autosave */
  private triggerAutosave(newValue: any): void 
  {
    this.trackerService.updateValue(this.control.id, newValue);
  }

  /**
   * Function called to save inputs 
   * Important to setting view mode as well for forms with multiple inputs for configuration.
   */
  saveInputConfig(): void 
  {
    if (this.textInputForm.valid) {
      const inputConfigs = this.textInputForm.value;  // Capture form values
      this.element = inputConfigs
      this.showConfigs = false;  // Hide configuration form
      this.triggerAutosave(this.element)
    }
  }
}
