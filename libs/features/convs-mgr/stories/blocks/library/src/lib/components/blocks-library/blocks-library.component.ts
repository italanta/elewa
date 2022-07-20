import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Logger } from '@iote/bricks-angular';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryEditorFrame, StoryEditorInitialiserService } from '@app/features/convs-mgr/stories/blocks/main';

/**
 * Component which holds a library (list) of all blocks that can be created 
 *    in the story editor
 */
@Component({
  selector: 'app-blocks-library',
  templateUrl: './blocks-library.component.html',
  styleUrls: ['./blocks-library.component.scss']
})
export class BlocksLibraryComponent implements OnInit
{
  @Input() frame: StoryEditorFrame;

  blockTemplates: TextMessageBlock[] = [{ id: 'io-block', type: StoryBlockTypes.Structural, message: 'Text Block' } as TextMessageBlock];

  constructor(private _renderer: Renderer2,
              private _frameInitialiser: StoryEditorInitialiserService,
              private _logger: Logger) 
  { }

  ngOnInit(): void {
    // WARN in case frame is not yet loaded. This might cause issues on the node loader.
    if(!this.frame || !this.frame.loaded)
      this._logger.warn(() => `Blocks library loaded yet frame not yet loaded.`);
  }
  
}
