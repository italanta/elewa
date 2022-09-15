import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { NameMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-name-block',
  templateUrl: './name-block.component.html',
  styleUrls: ['./name-block.component.scss'],
})
export class NameBlockComponent implements OnInit, AfterViewInit 
{
  @Input() id: string;
  @Input() block: NameMessageBlock;
  @Input() nameMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  nameInputId: string;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.nameInputId = `name-${this.id}`
  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() {
    let input = document.getElementById(this.nameInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

}
