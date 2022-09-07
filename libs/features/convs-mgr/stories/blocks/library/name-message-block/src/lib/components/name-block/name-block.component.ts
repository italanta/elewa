import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { NameMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '../../providers/jsplumb-decorator.function';

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


  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.jsPlumb) {
      this._decorateInput();
    }
  }

  private _decorateInput() {
    let input = document.getElementById('message') as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }

}


