import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-message-block',
  templateUrl: './message-block.component.html',
  styleUrls: ['./message-block.component.scss']
})
export class MessageBlockComponent
{
  @Input() id: string;
  @Input() block: TextMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() textMessageForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.TextMessage;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _logger: Logger) 
  { }
}
