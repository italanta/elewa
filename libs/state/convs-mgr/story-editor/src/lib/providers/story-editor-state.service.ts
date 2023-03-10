import { Injectable } from '@angular/core';
import { flatten as ___flatten, cloneDeep as ___cloneDeep } from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { StoryBlock, StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { BlockConnectionsService, StoryConnectionsStore } from '@app/state/convs-mgr/stories/block-connections';

import { StoryEditorState } from '../model/story-editor-state.model';

/** 
 * Service responsible for persisting the state of stories from the editor.
 *  
 *  This includes saving their blocks and story updates
 */
@Injectable()
export class StoryEditorStateService {
  /** The first load of each time the story editor service was called.
   *  We need this param to diff. between discarded and newly loaded blocks. */
  private _lastLoadedState: StoryEditorState | null;
  private _isSaving = false;

  constructor(private _story$$: ActiveStoryStore,
              private _blocks$$: StoryBlocksStore,
              private _connections$$: StoryConnectionsStore,
              private _blockConnectionsService: BlockConnectionsService,
              private _logger: Logger) { }

  /**
   * Service which returns the data state of the editor.
   *  To use in onInit
   *
   * @warn    : For the persistance to work, the story editor page should only take one of these on load.
   * @returns : The initial state of the story editor @see {StoryEditorState}
   */
  get(): Observable<StoryEditorState> {
    const state$ = this._story$$.get().pipe(
                      switchMap(story => story ? combineLatest([of(story), this._blocks$$.getBlocksByStory(story.id!), this._connections$$.get()]) 
                                                : of([])));

    const stateData$ = state$.pipe(map(([story, blocks, connections]) => ({ story, blocks, connections }) as StoryEditorState));

    // Store the first load to later diff. between previous and new state (to allow deletion of blocks etc.)
    stateData$.pipe(take(1)).subscribe(state => this._lastLoadedState = ___cloneDeep(state));

    // Return state.
    return stateData$;
  }

  /** Persists a story editor state. */
  persist(state: StoryEditorState) {
    if (this._isSaving)
      throw new Error('Story editor already saving. Wait for earlier save to be done.')
    // Avoid double save
    this._isSaving = true;

    // let connections = state. .getJsPlumbConnections as any[];

    const newConnections = this._determineConnectiontions(state.connections);

    const updateStory$ = this._story$$.update(state.story);

    // return the save stream for new connections only when new connections are available
    const addNewConnections$ = newConnections.length > 0
      ? this._blockConnectionsService.addNewConnections(newConnections)
      : of(false);

    const blockActions$ = this._determineBlockActions(state.blocks);
    const actions$ = blockActions$.concat([updateStory$ as any, addNewConnections$]);

    // Persist the story and all the blocks
    return combineLatest(actions$)
      .pipe(tap(() => this._lastLoadedState = ___cloneDeep(state)),
            tap(() => this._isSaving = false),
            catchError(err => {
              this._logger.log(() => `Error saving story editor state, ${err}`);
              alert('Error saving story, please try again. If the problem persists, contact support.');
              this._isSaving = false;
              return of(err);
            }));
  }

  /**
   * Determines which persist actions to take to update from a previous to a current state.
   * 
   * @param blocks - The new blocks
   * @returns A list of database actions to take.
   */
  private _determineBlockActions(blocks: StoryBlock[]) {
    const oldBlocks = (this._lastLoadedState as StoryEditorState).blocks;

    // Blocks which are newly created and newly configured
    const newBlocks = blocks.filter(nBl => !oldBlocks.find(oBl => nBl.id === oBl.id));
    // Blocks which were deleted

    const delBlocks = oldBlocks.filter(oBl => (oBl.id !== 'story-end-anchor' && !blocks.find(nBl => nBl.id === oBl.id)));
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
  private _determineConnectiontions(connections: StoryBlockConnection[]) {
    // fetches only the new connections
    const newConnections = this.fetchNewJsPlumbCOnnections(connections);

    //TODO: chain connections actions -> refer to determineBlockActions
    return newConnections;
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

  private fetchNewJsPlumbCOnnections(connections: StoryBlockConnection[]): StoryBlockConnection[] {

    /** after add multiple jsplumb adds a target connection to state */
    /** the filter removes the jsplumb duplicate connection as it's not needed */
    /** it also ensures every save has only unique values i.e length > 0 */
    return connections.filter((c) => !c.targetId.includes('jsplumb'))
      .map(c => {
        return {
          id: c.id,
          sourceId: c.sourceId,
          slot: 0,
          targetId: c.targetId
        }
      });
  }

  /** 
   * Reset the state to null 
   *  - to use in onDestroy */
  flush() {
    this._lastLoadedState = null;
  }
}
