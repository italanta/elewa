import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { StoryBlock, StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { variableBlocksStore } from '@app/state/convs-mgr/variables';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  /** list of blocks with variables already set */
  blocksWithVars$: Observable<StoryBlock[]>;

  constructor(
    private _blockStore$$: StoryBlocksStore,
    private _variablesStore$$: variableBlocksStore
    ) {
    this.blocksWithVars$ = this.getBlocksWithVars();
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

  saveVariables(variables: StoryBlockVariable) {
    // Assuming you have a method in your variableBlocksStore to save variables
    const variableId = variables.id; // Assuming variables.id is a string
    this._variablesStore$$.write(variables, variableId);
  }

  getVariablesByBot(botId:string, orgId:string) : Observable<StoryBlockVariable[]>{
    return this._variablesStore$$.getBotVariables(botId, orgId)
  }
}
