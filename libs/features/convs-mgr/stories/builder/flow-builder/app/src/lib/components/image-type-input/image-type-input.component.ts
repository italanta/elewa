import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';

@Component({
  selector: 'lib-image-type-input',
  templateUrl: './image-type-input.component.html',
  styleUrl: './image-type-input.component.scss',
})
export class ImageTypeInputComponent implements OnInit
{
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl

  /** Dynamic input id */
  inputId = '';
  imageInputForm: FormGroup;

  /** View Container */
  vrc = inject(ViewContainerRef)


  private _sbS = new SubSink ()

  constructor() {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;

  }

}
