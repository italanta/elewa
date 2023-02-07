import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { OpenEndedQuestionBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-open-ended-question-block',
  templateUrl: './open-ended-question-block.component.html',
  styleUrls: ['./open-ended-question-block.component.scss'],
})
export class OpenEndedQuestionBlockComponent implements OnInit{
  @Input() id: string;
  @Input() block: OpenEndedQuestionBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() openEndedQuestionForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  openQuestiontype = StoryBlockTypes.OpenEndedQuestion;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _logger: Logger) 
  { }
  
  ngOnInit(): void {}
}