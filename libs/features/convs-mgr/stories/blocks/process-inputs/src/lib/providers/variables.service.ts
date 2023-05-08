import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  /** list of blocks with variables already set */
  blocksWithVars$: Observable<StoryBlock[]>;

  constructor(private _blockStore$$: StoryBlocksStore) {
    this.blocksWithVars$ = this.getBlocksWithVars()
  }

  getBlocksWithVars() {
    return this._blockStore$$
    .get()
    .pipe(
      map((blocks) =>
        blocks.filter(
          (block) =>
          // ignore deleted blocks, end blocks and blocks with the variables as an empty string or undefined
            !block.deleted && block.type < 1000 && block.variable?.name !== '' && block.variable?.name != undefined
        )
      )
    );
  }

  getAllVariables() : Observable<string[]> {
    return this.blocksWithVars$.pipe(
      map((blocks) => blocks.map((block) => block.variable?.name) as string[])
    );
  }
}
