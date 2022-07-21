import { Injectable } from '@angular/core';
import { flatten as ___flatten, cloneDeep as ___cloneDeep } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

import { StoryEditorState } from '../model/story-editor-state.model';

/** 
 * Service responsible for persisting the state of stories from the editor.
 *  
 *  This includes saving their blocks and story updates
 */
@Injectable()
export class StoryEditorStateService
{
  /** The first load of each time the story editor service was called.
   *  We need this param to diff. between discarded and newly loaded blocks. */
  private _lastLoadedState : StoryEditorState | null;

  constructor(private _story$$: ActiveStoryStore,
              private _blocks$$: StoryBlocksStore,
              private _logger: Logger)
  { }

  /**
   * Service which returns the data state of the editor.
   *  To use in onInit
   *
   * @warn    : For the persistance to work, the story editor page should only take one of these on load.
   * @returns : The initial state of the story editor @see {StoryEditorState}
   */
  get() : Observable<StoryEditorState>
  {
    const state$ = 
      combineLatest([this._story$$.get(), this._blocks$$.get()])
        .pipe(
          map(([story, blocks]) => ({ story, blocks }) as StoryEditorState));

    // Store the first load to later diff. between previous and new state (to allow deletion of blocks etc.)
    state$.pipe(take(1)).subscribe(state => this._lastLoadedState = ___cloneDeep(state));
      
    // Return state.
    return state$;
  }

  /** Persists a story editor state. */
  persist(state: StoryEditorState)
  {
    const updateStory$ = this._story$$.update(state.story);
    const blockActions$ = this._determineBlockActions(state.blocks);

    const actions$ = blockActions$.concat([updateStory$ as any]);

    // Persist the story and all the blocks
    return combineLatest(actions$);
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * 
   * @param blocks - The new blocks
   * @returns A list of database actions to take.
   */
  private _determineBlockActions(blocks: StoryBlock[])
  {
    const oldBlocks = (this._lastLoadedState as StoryEditorState).blocks;

    // Blocks which are newly created and newly configured
    const newBlocks = blocks.filter(nBl => !oldBlocks.find(oBl => nBl.id === oBl.id));
    // Blocks which were deleted
    const delBlocks = oldBlocks.filter (oBl => !blocks.find(nBl => nBl.id === oBl.id));
    // Blocks which were updated.
    const updBlocks = blocks.filter(nBl => !newBlocks.concat(delBlocks)
                                                       .find(aBl => nBl.id === aBl.id));
    const newBlocks$ = newBlocks.map(bl => this._createBlock(bl));
    const delBlocks$ = delBlocks.map(bl => this._deleteBlock(bl));
    const updBlocks$ = updBlocks.map(bl => this._updateBlock(bl));

    return ___flatten([
        newBlocks$, delBlocks$, updBlocks$
    ]);
  }

  private _createBlock(block: StoryBlock) {
    return this._blocks$$.add(block, block.id);
  }

  /** We cannot just delete blocks as active chat users might have their cursor on that block. 
   *  We still need to service them with the older flow. */
  private _deleteBlock(oldBlock: StoryBlock) {
    oldBlock.deleted = true;
    return this._updateBlock(oldBlock);
  }

  private _updateBlock(block: StoryBlock) {
    return this._blocks$$.update(block);
  }

  /** 
   * Reset the state to null 
   *  - to use in onDestroy */
  flush() {
    this._lastLoadedState = null;
  }
}
