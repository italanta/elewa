import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { AnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-anchor-block',
  templateUrl: './anchor-block.component.html',
  styleUrls: ['./anchor-block.component.scss'],
})
export class AnchorBlockComponent implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() block: AnchorBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() anchorBlockForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void 
  {
    this._decorateInput();
  }

  private _decorateInput() 
  {
    let input = document.getElementById(this.id) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
