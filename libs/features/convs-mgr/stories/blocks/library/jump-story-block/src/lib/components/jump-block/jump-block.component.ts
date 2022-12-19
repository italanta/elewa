import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
// import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { JumpBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-jump-block',
  templateUrl: './message-block.component.html',
  styleUrls: ['./message-block.component.scss']
})
export class JumpBlockComponent implements OnInit
{
  @Input() id: string;
  @Input() block: JumpBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() jumpBlockForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.TextMessage;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _logger: Logger) 
  { }
  
  ngOnInit(): void {
    if(this.jsPlumb) {
      this._decorateElement();
    }
  }

  private _decorateElement(){
    const element = document.getElementById(this.id) as Element;
    if(this.jsPlumb) {
      _JsPlumbComponentDecorator(element, this.jsPlumb);
    }
  }
}
