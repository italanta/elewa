import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { SubSink } from 'subsink';

import { FlowControl } from '../../providers/flow-controls.const';
import { FlowBuilderStateProvider } from '../../providers/flow-buiilder-state.provider';
import { EditorComponentFactory } from '../../services/editor-component-factory.service';
import { ChangeTrackerService } from '../../providers/track-changes.service';


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
               private editorComponentFactory: EditorComponentFactory,
               private trackerService: ChangeTrackerService
  ) { }

  ngOnInit(): void {
    this.trackerService.change$.subscribe((events: Array<{ controlId: string; newValue: any }>) => {
      events.forEach(({ controlId, newValue }) => {
        console.log(`Control ${controlId} changed to ${newValue}`);
        
      });
    });
  }
  
  /** Function handling drag and drop functionality for a component */
  drop(event: CdkDragDrop<FlowControl[]>) 
  {
    const draggedData = event.item.data; // Access the dragged data directly

    if (draggedData) {
      // Push the dragged item to the flowEls array
      this.flowEls.push(draggedData);

      // Find the index of the item being dropped
      const index = this.flowEls.findIndex(item => item.id === draggedData.id);

      if (index !== -1) {
        // Set the 'dropped' flag for the item at the found index
        this.flowEls[index].dropped = true;

        //Transfer the item between arrays 
        if (event.previousContainer === event.container) {
          moveItemInArray(this.flowEls, index, event.currentIndex);
        }
        // Update the FlowBuilderStateProvider with the modified list
      this.flowStateProvider.setControls(this.flowEls);
      }
    }
  }
  /** Opening an editable field when user clicks on a dropped element */
  funcClick(element: FlowControl, id: string) {
    if (element.dropped) {
      const componentRef = this.editorComponentFactory.createEditorComponent(element, this.vcr);

      console.log('Component Created:', componentRef.componentType);

      componentRef.instance.control = element

      componentRef.instance.type = element.type;  // Pass the value to the component

      componentRef.changeDetectorRef.detectChanges();
    }
  }   

  ngOnDestroy(): void { }
}

