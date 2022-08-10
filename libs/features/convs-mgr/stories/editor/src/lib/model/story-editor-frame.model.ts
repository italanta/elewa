import { ButtonsBlock } from '@app/model/convs-mgr/stories/blocks/scenario';
import { ViewContainerRef } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockTypes, StoryBlockConnection } from '@app/model/convs-mgr/stories/blocks/main';
import { TextMessageBlock, QuestionButtonsBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library';
import { FormArray, FormBuilder } from '@angular/forms';

/**
 * Model which holds the state of a story-editor.
 * 
 * For each JsPlumb frame, an instance of this class is created which 1-on-1 manages the frame state.
 * Responsible for keeping track of editor data and for re-loading past saved states.
 */
export class StoryEditorFrame<T> 
{
  private _cnt = 1;
  loaded = false;
  
  private _state: StoryEditorState;
  private _story: Story;
  private _blocks: StoryBlock[] = [];
  blocksArray: FormArray;

  constructor(private _fb: FormBuilder,
              private _jsPlumb: BrowserJsPlumbInstance,
              private _viewport: ViewContainerRef,
              private _blocksInjector: BlockInjectorService
            )
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

    this.blocksArray = this._fb.array([]);
    // Clear any previously drawn items.
    this._viewport.clear();
    this._jsPlumb.reset();

    this._jsPlumb.setSuspendDrawing(true);           // Start loading drawing

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
  * Snapshot of the story blocks-state when updated
  **/
  get updatedBlocks(): FormArray {
    return this.blocksArray;
  }

  getJsInstance() {
    return this._jsPlumb.getConnections();
  }
  
  /** 
   * Create a new block for the frame.
   * TODO: Move this to a factory later
   */
  newBlock(type: StoryBlockTypes)
  {
    // TODO - Dynamic rendering of default blocks.

    let block:TextMessageBlock | QuestionButtonsBlock<T>;

    switch (type) {
      case StoryBlockTypes.TextMessage:
        block = { id: `${this._cnt}`, 
        type: StoryBlockTypes.TextMessage, 
        message: 'New message', 
        // TODO: Positioning in the middle + offset based on _cnt
        position: { x: 200, y: 50 } } as TextMessageBlock;
        break;
      case StoryBlockTypes.IO:
          block = { id: `${this._cnt}`, 
          type: StoryBlockTypes.IO, 
          question: 'New question', 
          // TODO: Positioning in the middle + offset based on _cnt
          position: { x: 200, y: 50 },
          deleted:false } as QuestionButtonsBlock<T>; //REMEMBER TO REVIEW THIS
          break;
      default:
        block = { id: `${this._cnt}`, 
        type: StoryBlockTypes.TextMessage, 
        message: 'New message', 
        // TODO: Positioning in the middle + offset based on _cnt
        position: { x: 200, y: 50 } } as TextMessageBlock;
        break;
    }

    this._cnt++;

    this._blocks.push(block);
    return this._injectBlockToFrame(block);
  }

  /** 
   * Private method which draws the block on the frame.
   * @see {BlockInjectorService} - package @app/features/convs-mgr/stories/blocks/library
   */
  private _injectBlockToFrame(block: StoryBlock) {
    return this._blocksInjector.newBlock(block, this._jsPlumb, this._viewport,this.blocksArray);
  }
}
