import { Component, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';


@Component({
  selector: 'app-event-block',
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.scss'],
})
export class EventBlockComponent
{
  @Input() id: string;
  @Input() block: EventBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() eventBlockForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  eventType = StoryBlockTypes.Event;
  blockFormGroup: FormGroup;
}