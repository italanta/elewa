import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FlowControlType } from '../../providers/flow-controls.const';

@Component({
  selector: 'lib-flow-datepick-input',
  templateUrl: './flow-datepick-input.component.html',
  styleUrl: './flow-datepick-input.component.scss',
})
export class FlowDatepickInputComponent implements OnInit
{ 
  /** The type of input, for text inputs */
  type: FlowControlType
  flowControlType = FlowControlType;

  inputId = '';
  vrc = inject(ViewContainerRef)

  ngOnInit(): void 
  {
    this.inputId = `input-${this.flowControlType }`;
  }  
}