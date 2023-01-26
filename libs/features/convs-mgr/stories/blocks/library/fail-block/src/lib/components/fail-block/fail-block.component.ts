import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { Logger } from '@iote/bricks-angular';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-fail-block',
  templateUrl: './fail-block.component.html',
  styleUrls: ['./fail-block.component.scss'],
})
export class FailBlockComponent implements OnInit{
  @Input() id: string;
  @Input() block: TextMessageBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() failBlockForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.FailBlock;
  blockFormGroup: FormGroup;

  constructor(private _fb: FormBuilder,
              private _logger: Logger) 
  { }
  
  ngOnInit(): void {}
}
