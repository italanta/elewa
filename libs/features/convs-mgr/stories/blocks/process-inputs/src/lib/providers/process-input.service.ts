import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

@Injectable({
  providedIn: 'root'
})
export class ProcessInputService {
  /** list of blocks with variables already set */
  blocksWithVars$: Observable<StoryBlock[]>;

  constructor(private _blockStore$$: StoryBlocksStore) {
    this.blocksWithVars$ = this._blockStore$$
      .get()
      .pipe(
        map((blocks) =>
          blocks.filter(
            (block) =>
              !block.deleted && block.type < 1000 && block.variable?.name !== ''
          )
        )
      );
  }
}
