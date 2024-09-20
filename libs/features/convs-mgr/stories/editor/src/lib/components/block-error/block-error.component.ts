import { Component, Input } from '@angular/core';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { BlockError, BlockErrorTypes } from '@app/model/convs-mgr/stories/blocks/scenario';

@Component({
  selector: 'convl-block-error',
  templateUrl: './block-error.component.html',
  styleUrl: './block-error.component.scss',
})
export class BlockErrorComponent {
  @Input() blockError: BlockError 
  blockTypes = StoryBlockTypes
  blockErrorTypes = BlockErrorTypes
}
