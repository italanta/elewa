import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '../../providers/jsplumb-decorator.function';

@Component({
  selector: 'app-option-view-field',
  templateUrl: './option-view-field.component.html',
  styleUrls: ['./option-view-field.component.scss'],
})
export class OptionViewFieldComponent implements OnInit, AfterViewInit {
  @Input() blockFormGroup: FormGroup;
  @Input() formGroupNameInput: number | string;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() optionClass: string;

  UniqueId: string;

  ngOnInit(): void {
    this.UniqueId = `i-${this.formGroupNameInput}-${this.blockFormGroup.value.id}`;
  }

  ngAfterViewInit(): void {
    this._decorateInput();
  }

  private _decorateInput() {
    const input = document.getElementById(this.UniqueId) as Element;

    if (this.jsPlumb) {
      _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
