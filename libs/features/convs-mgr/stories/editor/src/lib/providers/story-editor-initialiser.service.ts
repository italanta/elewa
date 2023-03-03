import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { newInstance as initJsPlumb } from '@jsplumb/browser-ui';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library/main';

import { BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';

import { StoryEditorFrame } from '../model/story-editor-frame.model';

@Injectable()
export class StoryEditorInitialiserService {
  constructor(private _fb: FormBuilder,
    private _blocksInjector: BlockInjectorService,
    private _connectionsService: BlockConnectionsService
  ) { }

  initialiseEditor(editorContainer: ElementRef<HTMLElement>,
    viewport: ViewContainerRef) {
    // Get inner HTML element from reference
    const container = editorContainer.nativeElement;

    // Initialise div as a _jsPlumb instance
    const _jsplumb = initJsPlumb({
      container,
      
      // paintStyle: { strokeWidth: 1 },
      // anchors: [["Left", "Right", "Bottom"], ["Top", "Bottom"]],
    });

    _jsplumb.addClass(container, "jsplumb_instance")

    return new StoryEditorFrame(this._fb, _jsplumb, this._blocksInjector, viewport, this._connectionsService);
  }
}
