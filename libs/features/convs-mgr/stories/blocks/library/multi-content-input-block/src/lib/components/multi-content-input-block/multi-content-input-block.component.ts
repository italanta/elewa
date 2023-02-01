import { Component, AfterViewInit, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { MultiContentInputBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { _JsPlumbComponentDecorator } from '../../../../../block-options/src/lib/providers/jsplumb-decorator.function';

@Component({
  selector: 'app-multi-content-input-block',
  templateUrl: './multi-content-input-block.component.html',
  styleUrls: ['./multi-content-input-block.component.scss'],
})
export class MultiContentInputBlockComponent<T> implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() block: MultiContentInputBlock;
  @Input() multiContentInputBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() blockFormGroup: FormGroup;

  type: StoryBlockTypes;
  multiContentInputType= StoryBlockTypes.MultiContentInput;
  buttonId: string;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.buttonId = `multi-content-btns`;
  }
  ngAfterViewInit(): void
  {
    if (this.jsPlumb && this.multiContentInputBlock.value) {
      this._decorateInput();
    }
  }

  private _decorateInput() 
  {
    const btns = Array.from(document.getElementsByClassName(this.buttonId)) as Element[];
    if (this.jsPlumb) {
      btns.forEach((btn) => {
       btn = _JsPlumbComponentDecorator(btn, this.jsPlumb);
      })
    }
  }
}