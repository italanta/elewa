import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ContainmentType, newInstance as initJsPlumb } from '@jsplumb/browser-ui';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library/main';

import { StoryEditorFrame } from '../model/story-editor-frame.model';

@Injectable()
export class StoryEditorInitialiserService
{
  
  constructor(private _fb: FormBuilder,
              private _blocksInjector: BlockInjectorService) 
  { }

  initialiseEditor(editorContainer: ElementRef<HTMLElement>,
                   viewport: ViewContainerRef) 
  {
    // Get inner HTML element from reference
    const container = editorContainer.nativeElement;

    // Initialise div as a _jsPlumb instance
    const _jsplumb = initJsPlumb({
      container,
      dragOptions:{
        containment: ContainmentType.parent
      },
      // paintStyle: { strokeWidth: 1 },
      // anchors: [["Left", "Right", "Bottom"], ["Top", "Bottom"]],
    });

    _jsplumb.addClass(container, "jsplumb_instance");

    return new StoryEditorFrame(this._fb, _jsplumb, this._blocksInjector, viewport, editorContainer);
  }
}
