import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';

import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-message-block',
  templateUrl: './message-block.component.html',
  styleUrls: ['./message-block.component.scss']
})
export class MessageBlockComponent implements OnInit
{
  @Input() id: string;
  @Input() block: TextMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() textMessageForm: FormGroup

  constructor(private _fb: FormBuilder,
              private _logger: Logger) 
  { }
  
  ngOnInit(): void {}

}
