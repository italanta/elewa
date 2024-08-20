import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { SubSink } from 'subsink';

import { FlowPageLayoutElementTypesV31, FlowPageTextSizesV31, FlowPageTextV31 } from '@app/model/convs-mgr/stories/flows';

import { FlowControl } from '../../providers/flow-controls.const';
import { FlowBuilderStateProvider } from '../../providers/flow-dragdrop-helper.provider';

import { EditorComponentFactory } from '../../services/editor-component-factory.service.ts';

@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.scss']
})
export class FlowEditorComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();
  flowEls: FlowControl[] = [];

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;

  constructor( private flowStateProvider: FlowBuilderStateProvider,
               private editorComponentFactory: EditorComponentFactory
  ) { }

  ngOnInit(): void 
  { 
    this.buildJsonFromEditor()
  }

  /** Function handling drag and droop functionality for a component */
  drop(event: CdkDragDrop<FlowControl[]>) 
  {
    const draggedData = this.flowStateProvider.getDragData();
    if (draggedData) {
      // Push the dragged item to the flowEls array
      this.flowEls.push(draggedData);
      // Find the index of the item being dropped
      const index = this.flowEls.findIndex(item => item.id === draggedData.id);

      if (index !== -1) {
        // Set the 'dropped' flag for the item at the found index
        this.flowEls[index].dropped = true;
  
        this.flowStateProvider.clearDragData();
        
        // Transfer the item between arrays 
        if (event.previousContainer === event.container) {
          moveItemInArray(this.flowEls, index, event.currentIndex);
        } else {
          transferArrayItem(this.flowEls, event.container.data, index, event.currentIndex);
        }
      }
    }
  }
  

  /** Opening an editable field when user clicks on a dropped element */
  funcClick(element: FlowControl, id: string) {
    if (element.dropped) {
      const componentRef = this.editorComponentFactory.createEditorComponent(element, this.vcr);

      console.log('Component Created:', componentRef.componentType);
      componentRef.instance.value = element.type;  // Pass the value to the component

      componentRef.changeDetectorRef.detectChanges();
    }
  }
 
  /** Transforming element value into Flow components */
 buildJsonFromEditor(): FlowPageTextV31[]
  {
    const elements = document.querySelectorAll('.config-container input[type="text"], .config-container textarea');
    const jsonStructure: FlowPageTextV31[] = [];
  
    elements.forEach(element => {
      const textElement = element as HTMLInputElement | HTMLTextAreaElement;
      //Defining size for text inputs
      const textSize = textElement.dataset['size'] as FlowPageTextSizesV31;
  
      if (textElement && textSize) {
        const flowPageText: FlowPageTextV31 = {
          text: textElement.value,
          size: textSize,
          type: FlowPageLayoutElementTypesV31.TEXT
        };
        jsonStructure.push(flowPageText);
      }
    });
    console.log(jsonStructure)
    return jsonStructure;
  }
   

  ngOnDestroy(): void { }
}

