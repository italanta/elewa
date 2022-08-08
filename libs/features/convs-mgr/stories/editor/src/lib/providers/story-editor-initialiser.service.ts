import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { newInstance as initJsPlumb } from '@jsplumb/browser-ui';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library';

import { StoryEditorFrame } from '../model/story-editor-frame.model';
import { FormBuilder } from '@angular/forms';

@Injectable()
export class StoryEditorInitialiserService 
{
  constructor(private _fb: FormBuilder,
              private _blocksInjector: BlockInjectorService) 
  {}

  initialiseEditor(editorContainer: ElementRef<HTMLElement>, 
                   viewport: ViewContainerRef)
  {
    // Get inner HTML element from reference
    const container = editorContainer.nativeElement;
    
    // Initialise div as a _jsPlumb instance
    const _jsplumb = initJsPlumb({ 
      container,
      
      // paintStyle: { strokeWidth: 1 },
      // anchors: [["Left", "Right", "Bottom"], ["Top", "Bottom"]],
    });

    return new StoryEditorFrame(this._fb, _jsplumb, this._blocksInjector, viewport);
  }
}
