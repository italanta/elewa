import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { v4 as uuidv4 } from 'uuid';
import { SubSink } from 'subsink';
import { ChangeTrackerService, FlowEditorStateProvider } from '@app/state/convs-mgr/wflows';

import { FlowControl } from '../../providers/flow-controls.const';
import { EditorComponentFactory } from '../../services/editor-component-factory.service';


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

  constructor( private flowStateProvider: FlowEditorStateProvider,
               private editorComponentFactory: EditorComponentFactory,
               private trackerService: ChangeTrackerService,
               private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.trackerService.change$.subscribe((events: Array<{ controlId: string; newValue: any }>) => {
      events.forEach(({ controlId, newValue }) => {
        console.log(`Control ${controlId} changed to ${newValue}`);
        
      });
    });
  }
  
  /** Function handling drag and drop functionality for a component */
  drop(event: CdkDragDrop<FlowControl[]>) {
    const draggedData = event.item.data;

    if (draggedData) {
      // Push the dragged item to the flowEls array
      this.flowEls.push(draggedData);
      
      const index = this.flowEls.length - 1;
      
      if (index !== -1) {
        const elem = this.flowEls[index];

        // Assign a unique ID using UUID
        elem.id = uuidv4(); 
        elem.dropped = true;

        // Handle array item transfers
        if (event.previousContainer === event.container) {
          moveItemInArray(this.flowEls, index, event.currentIndex);
        }

        this.cdr.detectChanges();
        this.flowStateProvider.setControls(this.flowEls); // Update the state provider
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

  ngOnDestroy(): void {
    console.log("destroyed")
   }
}

