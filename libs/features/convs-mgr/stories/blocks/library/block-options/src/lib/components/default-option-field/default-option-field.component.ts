import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '../../providers/jsplumb-decorator.function';

@Component({
  selector: 'app-default-option-field',
  templateUrl: './default-option-field.component.html',
  styleUrls: ['./default-option-field.component.scss'],
})
export class DefaultOptionFieldComponent implements OnInit, AfterViewInit {

  @Input() blockFormGroup: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  inputUniqueId: string;

  constructor() { }

  ngOnInit(): void {
    this.inputUniqueId = `defo-${this.blockFormGroup.value.id}`;
    const control = this.blockFormGroup?.get("defaultTarget");
    if (!control) {
      this.blockFormGroup.addControl("defaultTarget", new FormControl())
    }
  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() {
    let input = document.getElementById(this.inputUniqueId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
