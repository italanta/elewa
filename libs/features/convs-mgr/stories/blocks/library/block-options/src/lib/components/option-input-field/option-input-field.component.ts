import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '../../providers/jsplumb-decorator.function';

@Component({
  selector: 'app-option-input-field',
  templateUrl: './option-input-field.component.html',
  styleUrls: ['./option-input-field.component.scss'],
})
export class OptionInputFieldComponent implements OnInit, AfterViewInit {

  @Input() blockFormGroup: FormGroup;
  @Input() formGroupNameInput: number | string;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  inputUniqueId: string;

  constructor() {}

  ngOnInit(): void {
    this.inputUniqueId = `input-${this.formGroupNameInput}$-${this.blockFormGroup.value.id}`;
  }

  ngAfterViewInit(): void {
    this._decorateInput();
  }

  private _decorateInput() {
    let input = document.getElementById(this.inputUniqueId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
