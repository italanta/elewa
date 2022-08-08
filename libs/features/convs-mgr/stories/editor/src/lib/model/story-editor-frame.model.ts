import { ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library';

/**
 * Model which holds the state of a story-editor.
 * 
 * For each JsPlumb frame, an instance of this class is created which 1-on-1 manages the frame state.
 * Responsible for keeping track of editor data and for re-loading past saved states.
 */
export class StoryEditorFrame 
{
  private _cnt = 1;
  loaded = false;

  private _state: StoryEditorState;
  private _story: Story;
  private _blocks: StoryBlock[] = [];

  blocksArray: FormArray;

  constructor(private _fb: FormBuilder,
              private _jsPlumb: BrowserJsPlumbInstance,
              private _blocksInjector: BlockInjectorService,
              private _viewport: ViewContainerRef)
  {
    this.loaded = true;
  }

  /**
   * Function which produces the initial state of the story editor frame.
   *  It draws the previously saved blocks on the screen.
   * 
   * @param story   - Story visualised by the editor
   * @param blocks  - Blocks to render on the story
   */
  init(state: StoryEditorState)
  {
    this._state = state;
    this._story = state.story;
    this._blocks = state.blocks;

    // Clear any previously drawn items.
    this._viewport.clear();
    this._jsPlumb.reset();

    this._jsPlumb.setSuspendDrawing(true);           // Start loading drawing

    this.blocksArray = this._fb.array([]);

    // Init frame
    for(const block of this._blocks) {
      this._injectBlockToFrame(block);
      this._cnt++;
    }

    this._jsPlumb.setSuspendDrawing(false, true);   // All drawing data loaded. Now draw
  }

  /** 
   * Snapshot of the story blocks-state as edited and loaded in the frame. 
   */
  get state(): StoryEditorState {
    return this._state;
  }

  /** 
   * Snapshot of the story blocks as edited. 
   */
  get updatedBlocks(): FormArray {
    return this.blocksArray;
  }

  /** 
   * Create a new block for the frame.
   * TODO: Move this to a factory later
   */
  newBlock(type: StoryBlockTypes)
  {
    // TODO - Dynamic rendering of default blocks.
    const block = { id: `${this._cnt}`, 
                    type: type, 
                    message: 'New message', 
                    // TODO: Positioning in the middle + offset based on _cnt
                    position: { x: 200, y: 50 } 
    } as any;

    this._cnt++;

    this._blocks.push(block);
    return this._injectBlockToFrame(block);
  }

  /** 
   * Private method which draws the block on the frame.
   * @see {BlockInjectorService} - package @app/features/convs-mgr/stories/blocks/library
   */
  private _injectBlockToFrame(block: StoryBlock) {
    return this._blocksInjector.newBlock(block, this._jsPlumb, this._viewport, this.blocksArray);
  }
}
