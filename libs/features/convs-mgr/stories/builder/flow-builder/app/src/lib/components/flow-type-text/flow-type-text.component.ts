import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FlowControlType } from '../../providers/flow-controls.const';

@Component({
  selector: 'lib-flow-header-text',
  templateUrl: './flow-type-text.component.html',
  styleUrl: './flow-type-text.component.scss',
})
export class FlowHeaderTextComponent implements OnInit
{
  /** The type of input, for text inputs */
  @Input() type: FlowControlType
  flowControlTpe = FlowControlType

  inputId = '';
  vrc = inject(ViewContainerRef)


  ngOnInit(): void {
    this.inputId = `input-${this.type}`;
  }
}
