import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FlowControlType } from '../../providers/flow-controls.const';

@Component({
  selector: 'app-flow-type-input',
  templateUrl: './flow-type-input.component.html',
  styleUrl: './flow-type-input.component.scss',
})
export class FlowTypeInputComponent implements OnInit
{ 
  /** The type of input, for text inputs */
  type: FlowControlType
  flowControlType = FlowControlType;

  inputId = '';
  vrc = inject(ViewContainerRef)


  ngOnInit(): void 
  {
    this.inputId = `input-${this.flowControlType }`;
    console.log(this.flowControlType)
  }  
}
