import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { ChangeTrackerService } from '../../providers/track-changes.service';

@Component({
  selector: 'lib-flow-header-text',
  templateUrl: './flow-type-text.component.html',
  styleUrl: './flow-type-text.component.scss',
})
export class FlowTypeTextComponent implements OnInit, OnChanges
{
  /** The type of input, for text inputs */
  type: FlowControlType
  flowControlType = FlowControlType

  /** Cntrol being interacted with */s
  control: FlowControl;
  @Output() changeEvent = new EventEmitter<any>();

  inputId = '';
  vrc = inject(ViewContainerRef)

  constructor(private trackerService: ChangeTrackerService) {}

  ngOnInit(): void {
    this.inputId = `input-${this.control.type}`;
    console.log(this.control.type);
    /** Updating control state */
    this.trackerService.updateValue(this.control.id, this.control.type);
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
