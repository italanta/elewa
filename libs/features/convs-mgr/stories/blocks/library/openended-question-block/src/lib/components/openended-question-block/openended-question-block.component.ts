import { Component, Input } from '@angular/core';

import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { OpenEndedQuestionBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-openended-question-block',
  templateUrl: './openended-question-block.component.html',
  styleUrls: ['./openended-question-block.component.scss'],
})
export class OpenendedQuestionBlockComponent{
  @Input() id: string;
  @Input() block: OpenEndedQuestionBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() openendedQuestionForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  questiontype = StoryBlockTypes.OpenEnded;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _logger: Logger) 
  { }
  
}
