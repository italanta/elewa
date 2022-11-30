import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { ReplyMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-reply-block',
  templateUrl: './reply-block.component.html',
  styleUrls: ['./reply-block.component.scss'],
})
export class ReplyBlockComponent implements OnInit, AfterViewInit 
{
  @Input() id: string;
  @Input() block: ReplyMessageBlock;
  @Input() replyMessageForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  replyInputId: string;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.replyInputId = `rply-${this.id}`
  }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() {
    let input = document.getElementById(this.replyInputId) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

}