import { Renderer2 } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

/**
 * Model which holds the state of a story-editor.
 * 
 * For each JsPlumb frame, an instance of this class is created which 1-on-1 manages the frame state.
 */
export class StoryEditorFrame 
{
  loaded = false;

  constructor(private _renderer: Renderer2,
              private frame: BrowserJsPlumbInstance)
  {
    this.loaded = true;
  }

  draw()
  {
    
  }
}