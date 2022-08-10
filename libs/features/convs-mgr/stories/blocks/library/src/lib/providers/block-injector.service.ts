import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormArray } from '@angular/forms';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { BlockComponent } from '../components/block/block.component';

import { _JsPlumbComponentDecorator } from './jsplumb-decorator.function';

/**
 * The BlockInjector is part of the engine of the story-editor. 
 *  It creates blocks and positions them on editor.
 */
@Injectable()
export class BlockInjectorService 
{
  newBlock(block: StoryBlock, jsPlumb: BrowserJsPlumbInstance, viewport: ViewContainerRef, blocksGroup: FormArray) : ComponentRef<BlockComponent>
  {
    // 1. Init Angular component
    const blockComp = viewport.createComponent(BlockComponent);
   
    // Set block params
    blockComp.instance.id = block.id as string;
    blockComp.instance.block = block;
    blockComp.instance.jsPlumb = jsPlumb;
     blockComp.instance.blocksGroup = blocksGroup;

    // Set style to absolute to be draggable in jsPlumb
    blockComp.location.nativeElement.style = `position: absolute; left: ${block.position.x}px; top: ${block.position.y}px;`;

    viewport.insert(blockComp.hostView);

    // 2. Init JS plumb
    _JsPlumbComponentDecorator(block, blockComp, jsPlumb);

    return blockComp;
  }
}
