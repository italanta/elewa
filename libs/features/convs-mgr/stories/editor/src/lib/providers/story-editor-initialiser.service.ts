import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BrowserJsPlumbInstance, ContainmentType, newInstance as initJsPlumb } from '@jsplumb/browser-ui';

import { BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library/main';

import { StoryEditorFrame } from '../model/story-editor-frame.model';
import { CreateDeleteButton } from './manage-jsPlumb-connections.function';

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
      connectionOverlays: [
        {
          // Specify the type of overlay as "Custom"
          type: 'Custom',
          options: {
            // Set the id of the overlay to the connection id
            // id: "3",
            create: (component: any, conn: any) => {
              // Create the delete button element and return it
              return CreateDeleteButton();
            },
            // Set the location of the overlay as 0.5
            location: 0.5,
            events: {
              // Add a double-click event to the overlay
              dblclick: ((overlayData: any) => {
                debugger
                return DeleteConnectorbyID(overlayData)
              }).bind(this)
            },
          },
        },
      ],
      // paintStyle: { strokeWidth: 1 },
      // anchors: [["Left", "Right", "Bottom"], ["Top", "Bottom"]],
    });

    _jsplumb.addClass(container, "jsplumb_instance");

    return new StoryEditorFrame(this._fb, _jsplumb, this._blocksInjector, viewport, editorContainer);
  }
}

export function DeleteConnectorbyID(overlayData: any) {
  const connections = overlayData.overlay.instance.connections;
  const connectionId = overlayData.overlay.component.id;
  // Get an array of all connections using the jsPlumb library
  // const connections: any = jsPlumb.getConnections();

  // Filter the connections obtained from the jsPlumb library by the filtered connection ID
  const dCon = connections.filter((c: any) => (c.id === connectionId));
  debugger
  // Delete each filtered connection using the jsPlumb.deleteConnection method
  dCon.forEach((cn: any) => {
    overlayData.overlay.instance.deleteConnection(cn);
  });
}

