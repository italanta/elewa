import { ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockConnection, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library/main';
import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { AnchorBlockComponent } from '@app/features/convs-mgr/stories/blocks/library/anchor-block';
import { EndAnchorComponent } from '@app/features/convs-mgr/stories/blocks/library/anchor-block';

import { CreateDeleteButton, DeleteConnectorbyID } from '../providers/manage-jsPlumb-connections.function';
import { BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';

/**
 * Model which holds the state of a story-editor.
 *
 * For each JsPlumb frame, an instance of this class is created which 1-on-1 manages the frame state.
 * Responsible for keeping track of editor data and for re-loading past saved states.
 */
export class StoryEditorFrame {
  private _cnt = 1;
  loaded = false;

  private _state: StoryEditorState;
  private _story: Story;
  private _blocks: StoryBlock[] = [];
  private _connections: StoryBlockConnection[];

  blocksArray: FormArray;

  constructor(private _fb: FormBuilder,
    private _jsPlumb: BrowserJsPlumbInstance,
    private _blocksInjector: BlockInjectorService,
    private _viewport: ViewContainerRef,
    private _connectionsService: BlockConnectionsService
  ) {
    this.loaded = true;
  }

  /**
   * Function which produces the initial state of the story editor frame.
   *  It draws the previously saved blocks on the screen.
   *
   * @param story   - Story visualised by the editor
   * @param blocks  - Blocks to render on the story
   */
  async init(state: StoryEditorState) {
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

    await new Promise((resolve) => setTimeout(() => resolve(true), 1000)); // gives some time for drawing to end

    this.drawConnections();
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
    this._cnt++
    block.id = this._cnt.toString();
    return this._injectBlockToFrame(block);
  }

  createStartAnchor() {
    const startAnchor = this._viewport.createComponent(AnchorBlockComponent);
    startAnchor.instance.jsPlumb = this._jsPlumb;
  }

  /**
  * Function which draw the blocks.
  *
  */
  drawBlocks() {
    this._jsPlumb.setSuspendDrawing(true);   // Start loading drawing

    // Init frame
    const activeBlocks = this._blocks.filter((block) => !block.deleted);

    for (const block of activeBlocks) {
      this._injectBlockToFrame(block);
      this._cnt++;
    }

    this._jsPlumb.setSuspendDrawing(false, true);   // All drawing data loaded. Now draw
  }

  /**
  * Function which draw connections.
  * It draws the previously saved blocks on the screen.
  * Here we're perfoming a key feature of the frame which is drawing the existing
  * connections from the connections collection
  *
  */
  drawConnections() {
    // returns a static NodeList representing a list of the document's elements
    // that match the specified selector.
    // here we're holding the elements in an array inorder to find the source
    // and target elements for connection drawing later
    // sources are mostly inputs
    // targets (blocks) are wrapped inside a mat-card
    const domSourceInputs = Array.from(document.querySelectorAll("input"));
    const domBlockCards = Array.from(document.querySelectorAll('mat-card'));


    for (const conn of this._connections) {

      // anchorBlock.id == this._story.id!;
      // fetching the source (input) that matches the connection source id
      const sourceElement = domSourceInputs.find((el) => el.id == conn.sourceId);
      // fetching the target (block) that matches the connection target id
      const targetElement = domBlockCards.find((el) => el.id == conn.targetId);

      // more infor on connect can be found -> https://docs.jsplumbtoolkit.com/community-2.x/current/articles/connections.html
      // this._jsPlumb.bind("connection", function (info: any) {

      //   SetConnectionOverlay(info.connection, conn.id);

      // });
      this._jsPlumb.connect({
        id: conn.id,
        uuids: [conn.id, ""],
        source: sourceElement as Element,
        target: targetElement as Element,
        anchors: ["Right", "Left"],
        endpoints: ["Dot", "Rectangle"],
        overlays: [
          {
            // Specify the type of overlay as "Custom"
            type: "Custom",
            options: {
              // Set the id of the overlay to the connection id
              id: conn.id,
              create: (component: any, conn: any) => {
                // Create the delete button element and return it
                return CreateDeleteButton();
              },
              // Set the location of the overlay as 0.5
              location: 0.5,
              events: {
                // Add a double-click event to the overlay
                dblclick: (overlayData) => {
                  // Find the connection in the state object by the connection ID in the overlayData object
                  const con = this.state.connections.find((c) => c.id == overlayData.overlay.id);

                  // Call the `deleteConnection` method of the `_connectionsService` object
                  if(con) {
                    this._connectionsService.deleteConnection(con);
                  }

                  // Call the `DeleteConnectorbyID` function and pass in the `_jsPlumb` object, state object, and overlayData object as arguments
                  return DeleteConnectorbyID(this._jsPlumb, this.state, overlayData);
                }
              }
            }
          }
        ]
        ,
        connector: {
          type: 'Flowchart',
          options: {
            cssClass: 'frame-connector'
          }
        }

      });

    }
  }

  /**
   * Create a new block for the frame.
   * TODO: Move this to a factory later
   */
  newBlock(type: StoryBlockTypes) {
    const block = {
      id: `${this._cnt}`,
      type: type,
      message: '',
      // TODO: Positioning in the middle + offset based on _cnt
      position: { x: 200, y: 50 }
    } as StoryBlock;

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
