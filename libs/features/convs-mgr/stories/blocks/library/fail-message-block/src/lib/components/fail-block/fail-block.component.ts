import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { FailMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

/**
 * Block which sends an error message about the story to the user.
 */
@Component({
  selector: 'app-fail-block',
  templateUrl: './fail-block.component.html',
  styleUrls: ['./fail-block.component.scss']
})
export class FailMessageBlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: FailMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() failMessageForm: FormGroup

  @Input() blocksGroup: FormArray;

  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.Fail;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
    private _logger: Logger) { }

  ngOnInit(): void { }
}
