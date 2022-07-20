import { Component, Input, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit
{
  @Input() id: string;
  @Input() block: StoryBlock;

  type: StoryBlockTypes;

  messagetype = StoryBlockTypes.TextMessage;

  constructor(private _logger: Logger) 
  { }
  
  ngOnInit(): void {
    this.type = this.block.type;
  }

}
