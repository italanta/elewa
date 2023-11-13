import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbInputOptionDecorator } from '../../providers/jsplumb-decorator.function';

@Component({
  selector: 'app-default-option-field',
  templateUrl: './default-option-field.component.html',
  styleUrls: ['./default-option-field.component.scss'],
})
export class DefaultOptionFieldComponent implements OnInit, AfterViewInit 
{
  
  @Input() blockFormGroup: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  inputUniqueId: string;

  ngOnInit(): void 
  {
    this.inputUniqueId = `defo-${this.blockFormGroup.value.id}`;
  }

  ngAfterViewInit(): void
  {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() 
  {
    let input = document.getElementById(this.inputUniqueId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbInputOptionDecorator(input, this.jsPlumb);
    }
  }
}
