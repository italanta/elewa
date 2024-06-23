import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { cloneDeep as ___cloneDeep } from 'lodash';
import { take } from 'rxjs';
import { v4 as guid } from 'uuid'

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryEditorState } from '@app/state/convs-mgr/story-editor';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { BlockComponent } from '@app/features/convs-mgr/stories/builder/blocks/library/main';

import { _JsPlumbComponentDecorator } from '../transformers/jsplumb-decorator.util';
import { _DetermineBlockType } from '../transformers/block-inheritance.util';

/**
 * The BlockInjector is part of the engine of the story-editor. 
 *  It creates blocks and positions them on editor.
 */
@Injectable()
export class BlockInjectorService 
{
  newBlock(state: StoryEditorState, block: StoryBlock, jsPlumb: BrowserJsPlumbInstance, viewport: ViewContainerRef, blocksGroup: FormArray) : ComponentRef<BlockComponent>
  {
    // 1. Init Angular component
    const blockComp = viewport.createComponent(BlockComponent);
   
    // Set block params
    blockComp.instance.id = block.id as string;
    blockComp.instance.block = block;
    blockComp.instance.jsPlumb = jsPlumb;
    blockComp.instance.viewPort = viewport;

    blockComp.instance.blocksGroup = blocksGroup;

    blockComp.instance.viewPort = viewport;
    blockComp.instance.ref = blockComp;

    const _fb = viewport.injector.get<FormBuilder>(FormBuilder);
    blockComp.instance.blockFormGroup = _DetermineBlockType(block, block.type, _fb) as FormGroup;

    // Set style to absolute to be draggable in jsPlumb
    blockComp.location.nativeElement.style = `position: absolute; left: ${block.position.x}px; top: ${block.position.y}px;`;

    viewport.insert(blockComp.hostView);

    // 2. Init JS plumb
    _JsPlumbComponentDecorator(block, blockComp, jsPlumb);

    // 3. Add state listeners
    // On delete block
    blockComp.instance.deleteBlock.pipe(take(1)).subscribe(((block: StoryBlock) => { this._delete(state, block, blockComp, jsPlumb, viewport, blocksGroup) }).bind(this));
    // On copy block
    blockComp.instance.copyBlock.subscribe(((block: StoryBlock) => { this._copy(state, block, blockComp, jsPlumb, viewport, blocksGroup) }).bind(this));

    return blockComp;
  }

  /**
   * Delete the injected block
   * 
   * @param state - State reference in which the block lives
   * @param block - The block to delete
   * @param plumb - Plumb instance
   */
  private _delete(state: StoryEditorState, block: StoryBlock, ref: ComponentRef<BlockComponent>, plumb: BrowserJsPlumbInstance, viewport: ViewContainerRef, blocksGroup: FormArray)
  {
    // Remove the block from state and form
    state.blocks = state.blocks.filter(bl => bl.id !== block.id);
    blocksGroup.removeAt(blocksGroup.value.findIndex((bl: StoryBlock) => bl.id === block.id));

      // Remove the block from viewport
    // plumb.viewport.remove(block.id as string);
    const index = viewport.indexOf(ref.hostView);
    viewport.remove(index);

    // blockFormGroup.value.deleted = true;

    // Remove the connections linked to the block
    state.connections = state.connections.filter(conn => conn.sourceId !== block.id && conn.targetId !== block.id);
        // Remove on viewport - @see https://docs.jsplumbtoolkit.com/community/6.x/lib/querying
    const sourceConns = plumb.connections.filter(conn => conn.source.id.includes(block.id as string));
    const targetConns = plumb.connections.filter(conn => conn.target.id.includes(block.id as string) || conn.targetId.includes(block.id as string));

    // TODO: Also delete the connection endpoints
    sourceConns.forEach(c => plumb.deleteConnection(c));
    targetConns.forEach(c => plumb.deleteConnection(c));
  }

  /**
   * Copy the injected block
   * 
   * @param state - State reference in which the block lives
   * @param block - The block to copy
   * @param plumb - Plumb instance
   */
  private _copy(state: StoryEditorState, block: StoryBlock, ref: ComponentRef<BlockComponent>, plumb: BrowserJsPlumbInstance, viewport: ViewContainerRef, blocksGroup: FormArray)
  {
    const newBlock = ___cloneDeep(block);

    newBlock.id = guid().slice(0, 8);
    newBlock.position.x = block.position.x + 300;
    delete newBlock.createdBy;
    delete newBlock.createdOn;
    delete newBlock.updatedOn;

    state.blocks.push(newBlock);

   this.newBlock(state, newBlock, plumb, viewport, blocksGroup);
  }
}
