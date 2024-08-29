import { Component, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';

import { SubSink } from 'subsink';
import { debounceTime, Subject } from 'rxjs';

import { ChangeTrackerService, FlowBuilderStateProvider } from '@app/state/convs-mgr/wflows';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';


@Component({
  selector: 'app-flow-type-input',
  templateUrl: './flow-type-input.component.html',
  styleUrl: './flow-type-input.component.scss',
})
export class FlowTypeInputComponent implements OnInit, OnChanges
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
  inputName = '';
  inputLabel = '';
  dataSource: any[] = [];
   /** For adding new options dynamically */
  newOption = '';
  /** View Container */
  vrc = inject(ViewContainerRef)
  private autosaveSubject = new Subject<any>();

  /** Notify editor of changes */
  @Output() changeEvent = new EventEmitter<any>();

  private _sbS = new SubSink ()

  constructor(private trackerService: ChangeTrackerService,
    private flowStateProvider: FlowBuilderStateProvider
) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;
    if (this.control?.value) {
      this.inputName = this.control.value?.name || '';
      this.inputLabel = this.control.value?.label || '';
      this.dataSource = this.control.value?.dataSource || [];
    }

    // Setup autosave with debounce
    this.autosaveSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.triggerAutosave(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this.trackerService.updateValue(this.control.id, this.control.type);
    }
  }

  /** This method will debounce and trigger autosave */
  onInputChange(newValue: string): void {
    if (!this.control) {
      console.error('Control is undefined');
      return;
    }

    this.control.value = { ...this.control.value, value: newValue };
    // Emit the new value to trigger autosave after debounce
    this.autosaveSubject.next(newValue);
  }

  /** Trigger autosave */
  private triggerAutosave(newValue: any): void {
    this.trackerService.updateValue(this.control.id, newValue);
    this.changeEvent.emit({ controlId: this.control.id, newValue });
  }
  /** Track changes to input name */
  onNameChange(newName: string): void {
    this.inputName = newName;
    this.updateControlValue();
  }

  /** Track changes to input label */
  onLabelChange(newLabel: string): void {
    this.inputLabel = newLabel;
    this.updateControlValue();
  }

  /** Track changes to input options (e.g., for radio, select) */
  onDataSourceChange(newDataSource: any[]): void {
    this.dataSource = newDataSource;
    this.updateControlValue();
  }

  /** Update the FlowControl value with the new input data */
  private updateControlValue(): void {
    if (!this.control) {
      console.error('Control is undefined');
      return;
    }

    this.control.value = {
      name: this.inputName,
      label: this.inputLabel,
      dataSource: this.dataSource,
    };
    this.trackerService.updateValue(this.control.id, this.control.value);
    this.changeEvent.emit({ controlId: this.control.id, newValue: this.control.value });
  }

  /** Add a new option to dataSource */
  addOption(): void {
    if (this.newOption.trim() !== '') {
      this.dataSource.push({ label: this.newOption, value: this.newOption });
      this.newOption = '';
      this.updateControlValue();
    }
  }

  /** Remove an option from dataSource */
  removeOption(index: number): void {
    this.dataSource.splice(index, 1);
    this.updateControlValue();
  }
}
