import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockComponent } from '@app/features/convs-mgr/stories/blocks/library';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Injectable()
export class BlockInjectorService 
{
  newBlock(block: StoryBlock, jsPlumb: BrowserJsPlumbInstance, viewport: ViewContainerRef) : ComponentRef<BlockComponent>
  {
    // 1. Init Angular component
    const blockComp = viewport.createComponent(BlockComponent);
   
    // Set block params
    blockComp.instance.id = block.id as string;
    blockComp.instance.block = block;

    // Set style to absolute to be draggable in jsPlumb
    blockComp.location.nativeElement.style = `position: absolute; left: 50px; top: 50px;`;

    viewport.insert(blockComp.hostView);

    // 2. Init JS plumb

    jsPlumb.addEndpoint(blockComp.location.nativeElement, {
      endpoint: 'Dot',
      anchor: "Right",
      source: true
    });

    jsPlumb.addEndpoint(blockComp.location.nativeElement, {
      endpoint: 'Rectangle',
      anchor: "Left",
      target: true
    });

    return blockComp;
  }
}