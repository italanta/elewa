import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { ChangeTrackerService } from '../../providers/track-changes.service';
import { SubSink } from 'subsink';
import { FlowBuilderStateProvider } from '../../providers/flow-buiilder-state.provider';

@Component({
  selector: 'lib-flow-header-text',
  templateUrl: './flow-type-text.component.html',
  styleUrl: './flow-type-text.component.scss',
})
export class FlowTypeTextComponent implements OnInit, OnChanges
{
  /** The type of input, for text inputs */
  type: FlowControlType;
  flowControlType = FlowControlType;

  /** Cntrol being interacted with */
  control: FlowControl;
  @Output() changeEvent = new EventEmitter<any>();

  inputId = '';
  vrc = inject(ViewContainerRef)

  private _sbS = new SubSink ()

  constructor(private trackerService: ChangeTrackerService,
              private flowStateProvider: FlowBuilderStateProvider
  ) {}

  ngOnInit(): void {
    this.inputId = `input-${this.control.type}`;
    console.log(this.control.type);
    /** Updating control state */
    this._sbS.sink = this.trackerService.change$.subscribe((events: Array<{ controlId: string; newValue: any }>) => {
    events.forEach(({ controlId, newValue }) => {
      console.log(`Autosaving Control ${controlId} with value ${newValue}`);
      
      this.flowStateProvider.updateComponent({ group: this.control.group, label: this.control.label, icon: this.control.icon, id: controlId, type: FlowControlType.Text, value: newValue });
    });
  });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this.trackerService.updateValue(this.control.id, this.control.type);
    }
  }

  /*** Tracking user interactions with controls in real time */
  onInputChange(newValue: string): void {
    if (!this.control) {
      console.error('Control is undefined');
      return;
    }
    this.changeEvent.emit({ controlId: this.control.id, newValue });
    this.trackerService.updateValue(this.control.id, newValue);
  }
  
}
