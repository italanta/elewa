import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, debounceTime, filter } from 'rxjs';

import { ElementRef, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockConnection, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library/main';
import { AnchorBlockComponent } from '@app/features/convs-mgr/stories/blocks/library/anchor-block';

import { Coordinate } from './coordinates.interface';


/**
 * Model which holds the state of a story-editor.
 *
 * For each JsPlumb frame, an instance of this class is created which 1-on-1 manages the frame state.
 * Responsible for keeping track of editor data and for re-loading past saved states.
 */
export class StoryEditorFrame 
{
  loaded = false;

  private _state: StoryEditorState;
  private _story: Story;
  private _blocks: StoryBlock[] = [];
  private _newestBlock: StoryBlock | null;
  private _connections: StoryBlockConnection[];

  blocksArray: FormArray;
  
  
  private _frameChanges$$: BehaviorSubject<StoryEditorState> = new BehaviorSubject({ loading: true } as any as StoryEditorState);
  /** Observable tracking the changes to frame state. Used in frontend rendering of the minimap, 
   *    which takes a screenshot at each state change. */
  public frameChanges$ = this._frameChanges$$.pipe(
                              filter((state: any) => !state.loading),
                              debounceTime(500));


  constructor(private _fb: FormBuilder,
              private _jsPlumb: BrowserJsPlumbInstance,
              private _blocksInjector: BlockInjectorService,
              private _viewport: ViewContainerRef,
              private _edf: ElementRef<HTMLElement>) 
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
  async init(state: StoryEditorState) 
  {
    this._state = state;
    this._story = state.story;
    this._blocks = state.blocks;
    this._connections = state.connections;

    this.blocksArray = this._fb.array([]);

    // Clear any previously drawn items.
    this._viewport.clear();
    this._jsPlumb.reset();

    //create the anchor block when state is initialized
    this.createStartAnchor();

    this.drawBlocks();

    await new Promise((resolve) => setTimeout(() => resolve(true), 500)); // gives some time for drawing to end

    this.drawConnections();

    //scroll to the middle of the screen when connections are done drawing
    // this.scroll(this._edf.nativeElement)

    this._frameChanges$$.next(state);
  }

  get jsPlumbInstance(): BrowserJsPlumbInstance {
    return this._jsPlumb;
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

  get getJsPlumbConnections() {
    return this._jsPlumb.getConnections();
  }

  cloneBlock(block: StoryBlock) {
    block.id = this._getID()
    return this._injectBlockToFrame(block);
  }

  createStartAnchor() 
  {
    const editorWidth = 100;
    const editorHeight = 100;
    const startAnchor = this._viewport.createComponent(AnchorBlockComponent);
    startAnchor.instance.jsPlumb = this._jsPlumb;
    startAnchor.instance.anchorInput = this._story.id as string;

    //position the start anchor to center of viewport
    startAnchor.location.nativeElement.style = `position: absolute; left: ${editorWidth}px; top: ${editorHeight}px;`;
  }

  /**
   * Function which draw the blocks.
   *
   */
  drawBlocks() {
    this._jsPlumb.setSuspendDrawing(true); // Start loading drawing

    // Init frame
    const activeBlocks = this._blocks.filter((block) => !block.deleted);

    for (const block of activeBlocks) {
      this._injectBlockToFrame(block);
    }

    this._jsPlumb.setSuspendDrawing(false, true); // All drawing data loaded. Now draw
  }

  /**
   * Function which draw connections.
   * It draws the previously saved blocks on the screen.
   * Here we're perfoming a key feature of the frame which is drawing the existing
   *    connections from the connections collection
   */
  drawConnections() 
  {
    // returns a static NodeList representing a list of the document's elements
    // that match the specified selector.
    // here we're holding the elements in an array inorder to find the source
    // and target elements for connection drawing later
    // sources are mostly inputs
    // targets (blocks) are wrapped inside a mat-card
    const domSourceInputs = Array.from(document.querySelectorAll('input'));
    const domBlockCards = Array.from(document.querySelectorAll('mat-card'));

    // this._jsPlumb.setSuspendDrawing(true); // Start loading drawing

    for (const conn of this._connections) 
    {
      // anchorBlock.id == this._story.id!;
      // fetching the source (input) that matches the connection source id
      const sourceElement = domSourceInputs.find(
        (el) => el.id == conn.sourceId
      );
      // fetching the target (block) that matches the connection target id
      const targetElement = domBlockCards.find((el) => el.id == conn.targetId);

      // more infor on connect can be found -> https://docs.jsplumbtoolkit.com/community-2.x/current/articles/connections.html
      // this._jsPlumb.bind("connection", function (info: any) {

      //   SetConnectionOverlay(info.connection, conn.id);

      // });
      this._jsPlumb.connect({
        id: conn.id,
        uuids: [conn.id, ''],
        source: sourceElement as Element,
        target: targetElement as Element,
        anchors: ['Right', 'Left'],
        endpoints: ['Dot', 'Dot'],
        connector: {
          type: 'Flowchart',
          options: {
            cssClass: 'frame-connector',
            cornerRadius: 100
          },
        },
      });
    }

    // this._jsPlumb.setSuspendDrawing(false); // End loading drawing

    // Update the frame state listeners.
    this._frameChanges$$.next(this._state);
  }

  /**
   * Create a new block for the frame.
   * TODO: Move this to a factory later
   */
  newBlock(type: StoryBlockTypes, coordinates?:Coordinate) {

    let x, y;

    const filteredBlocks = this._blocks.filter((block)=> block.id !== 'story-end-anchor');

    this._newestBlock = filteredBlocks.length > 0 ? filteredBlocks[filteredBlocks.length-1] : null;

    if(this._newestBlock) {
      x = this._newestBlock.position.x + Math.floor(Math.random() * (200) + 20);
      y = this._newestBlock.position.y - Math.floor(Math.random() * (50) + 5);
    } else {
      x = 200;
      y = 50;
    }

    const block = {
      id: `${this._getID()}`,
      type: type,
      message: '',
      // TODO: Positioning in the middle + offset based on _cnt
      // position: coordinates || { x: 200, y: 50 },
      position: coordinates || { x: x, y: y},
    } as StoryBlock;

    this._blocks.push(block);
     
    return this._injectBlockToFrame(block);
  }

  /**
   * Private method which draws the block on the frame.
   * @see {BlockInjectorService} - package @app/features/convs-mgr/stories/blocks/library
   */
  private _injectBlockToFrame(block: StoryBlock) 
  {
    const blck = this._blocksInjector.newBlock(
      this._state,
      block,
      this._jsPlumb,
      this._viewport,
      this.blocksArray
    );

    // Update the frame state listeners.
    this._frameChanges$$.next(this._state);

    return blck;
  }

  private _getID() {
    return uuidv4().slice(0, 8);
  }

  // Section -- Zoom management

  /**
   * Set zoom level of the frame.
   * 
   * @param zoom - Number between 0.25 and 1 that indicates the zoom
   */
  public setZoom(zoom: number, repaint = false)
  {
    this._jsPlumb.setZoom(zoom, repaint);
  }

}
