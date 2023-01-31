import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { _JsPlumbTargetComponentDecorator, _JsPlumbTargetLeftComponentDecorator } from '../../providers/jsplumb-target-decorator.function';

@Component({
  selector: 'app-end-anchor',
  templateUrl: './end-anchor.component.html',
  styleUrls: ['./end-anchor.component.scss'],
})
export class EndAnchorComponent implements OnInit {

  @Input() id: string;
  @Input() block: EndStoryAnchorBlock;
  @Input() endStoryAnchorForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  
  endAnchorId: string = 'story-end-anchor';

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void
  {
    this._decorateInput();
  }


  private _decorateInput()
  {
    let input = document.getElementById(this.endAnchorId) as Element;
    if (this.jsPlumb)
    {
      input = _JsPlumbTargetLeftComponentDecorator(input, this.jsPlumb);
    }
  }
}
