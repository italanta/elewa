import { Injectable } from '@angular/core';

import { SubSink } from 'subsink';
import { flatten as ___flatten, cloneDeep as ___cloneDeep } from 'lodash';

import { combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { StoryBlock, StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { StoryConnectionsStore } from '@app/state/convs-mgr/stories/block-connections';

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
  private _lastLoadedState: StoryEditorState | null;

  private _isSaving = false;

  private _sBs = new SubSink();

  constructor(
    private _story$$: ActiveStoryStore,
    private _blocks$$: StoryBlocksStore,
    private _connections$$: StoryConnectionsStore,
    // private _blockConnectionsService: BlockConnectionsService,
    private _logger: Logger) 
  { }

  /**
   * Service which returns the data state of the editor.
   *  To use in onInit 
   *
   * @warn    : For the persistance to work, the story editor page should only take one of these on load.
   * @returns : The initial state of the story editor @see {StoryEditorState}
   */
  get(): Observable<StoryEditorState> 
  {
    const state$ = this._story$$.get().pipe(
                      debounceTime(500),
                      // Load story editor state. This includes the story itself, the blocks which it consists and the connections.
                      switchMap(story => story ? combineLatest([of(story), 
                                                                this._blocks$$.get(), 
                                                                this._connections$$.get()]) 
                                                : of([])));
    
    // The information is combined into a single state that contains all the latest objects.
    const stateData$ = state$.pipe(
      // Fix {CLM-73} - Multiple refresh bug on story saving.
      filter(() => !this._isSaving),
      map(([story, blocks, connections]) => ({ story, blocks, connections }) as StoryEditorState));

    // Store the first load to later diff. between previous and new state (to allow deletion of blocks etc.)
    stateData$.pipe(take(1)).subscribe((state) => (
      this._setLastLoadedState(state)
    ));

    // Return state.
    return stateData$;
  }

  /** Persists a story editor state. */
  persist(state: StoryEditorState) 
  {
    if (this._isSaving)
      throw new Error('Story editor already saving. Wait for earlier save to be done.')
    // Avoid double save
    this._isSaving = true;

    // Prepare save command that updates the story to it's new full state
    //  This is somewhat of a plan on how to turn the old story into a new one.
    const updateStory$ = this._story$$.update(state.story);
    const blockActions$ = this._determineBlockActions(state.blocks);
    const connectionActions$ = this._determineConnectionActions(state.connections);

    const actions$ = blockActions$.concat(connectionActions$ as Observable<any>[]) as Observable<StoryBlock | StoryBlockConnection>[];

    // Persist the story and all the blocks
    return combineLatest(actions$)
      .pipe(tap(() => this._setLastLoadedState(state)),
            tap(() => this._isSaving = false),
            catchError(err => {
              this._logger.log(() => `Error saving story editor state, ${err}`);
              alert('Error saving story, please try again. If the problem persists, contact support.');
              this._isSaving = false;
              return of(err);
            }),
            // Fix {CLM-73} - Multiple refresh bug on story saving.
            // See line 64, reloading has been blocked up to this point. By updating the story last (after isSaving is false again, we release the save lock.)
            switchMap(() => updateStory$));
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * 
   * Compares the past state (before save) with the current state (after save).
   * 
   * @param blocks - The new blocks
   * @returns A list of database actions to take.
   */
  private _determineBlockActions(blocks: StoryBlock[]) 
  {
    const oldBlocks = (this._lastLoadedState as StoryEditorState).blocks;

    // Blocks which are newly created and newly configured
    const newBlocks = blocks.filter(nBl => !oldBlocks.find(oBl => nBl.id === oBl.id));

    // Blocks which were deleted.
    const delBlocks = oldBlocks.filter(oBl => (oBl.id !== 'story-end-anchor' 
                                                && !blocks.find(nBl => nBl.id === oBl.id)));

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

  // Todo: check for deleted connections and upated conections
  private _determineConnectionActions(currCons: StoryBlockConnection[]) 
  {
    const oldConns = (this._lastLoadedState as StoryEditorState).connections;

    // Blocks which are newly created and newly configured
    const newConns = currCons.filter(nC => !oldConns.find(oC => nC.sourceId === oC.sourceId && nC.targetId === oC.targetId));
    // Blocks which were deleted.
    const delConns = oldConns.filter(oC => !currCons.find(nC => nC.sourceId === oC.sourceId && nC.targetId === oC.targetId));

    const newConns$ = newConns.map(bl => this._createConnection(bl));
    const delConns$ = delConns.map(bl => this._deleteConnection(bl));

    return newConns$.concat(delConns$);
  }

  /** Creates a block. */
  private _createBlock(block: StoryBlock) {
    return this._blocks$$.write(block, block.id as string); 
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

  private _createConnection(connection: StoryBlockConnection) {
    return this._connections$$.add(connection);
  }

  // @todo @reagan - investigate impact of deleting connections on the bot
  private _deleteConnection(connection: StoryBlockConnection) {
    // connection.deleted = true;
    // return this._connections$$.update(connection);
    return this._connections$$.remove(connection);
  }

  private _setLastLoadedState(state: StoryEditorState | null)
  {
    console.log(`:: Setting last loaded state ::`);
    console.debug(state);
    this._lastLoadedState = ___cloneDeep(state)
  }

  /** 
   * Reset the state to null 
   *  - to use in onDestroy */
  flush() {
    this._setLastLoadedState(null);
    this._sBs.unsubscribe();
  }
}
