import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { newInstance as initJsPlumb } from '@jsplumb/browser-ui';

import { StoryEditorFrame } from '../model/story-editor-frame.model';

@Injectable()
export class StoryEditorInitialiserService 
{
  initialiseEditor(renderer: Renderer2, editorContainer: ElementRef)
  {
    // Get inner HTML element from reference
    const container = editorContainer.nativeElement;
    
    // Initialise div as a _jsPlumb instance
    const _jsplumb = initJsPlumb({ container });

    return new StoryEditorFrame(renderer, _jsplumb);
  }
}