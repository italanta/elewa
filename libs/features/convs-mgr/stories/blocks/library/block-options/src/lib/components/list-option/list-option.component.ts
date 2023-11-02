import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';


import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '../../providers/jsplumb-decorator.function';

@Component({
  selector: 'app-list-option',
  templateUrl: './list-option.component.html',
  styleUrls: ['./list-option.component.scss'],
})
export class ListOptionComponent implements OnInit, AfterViewInit {

  @Input() blockFormGroup: FormGroup;
  @Input() formGroupNameInput: number | string;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() listItems: FormArray;

  listOptionId: string;

  constructor() {}

  ngOnInit(): void 
  {
    this.listOptionId = `i-${this.formGroupNameInput}-${this.blockFormGroup.value.id}`;
  }

  ngAfterViewInit(): void 
  {
    this._decorateInput();
  }

  private _decorateInput() 
  {
    let input = document.getElementById(this.listOptionId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}

