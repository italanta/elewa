import { v4 as ___guid } from 'uuid';
import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

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
  droppedElements: Observable<FlowControl[]>;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;

  constructor( private flowStateProvider: FlowEditorStateProvider,
               private editorComponentFactory: EditorComponentFactory,
               private trackerService: ChangeTrackerService,
               private cdr: ChangeDetectorRef,
  ) { 
    this.droppedElements = this.flowStateProvider.get();
  }

  ngOnInit(): void {
   this._sbS.sink = this.trackerService.change$.subscribe((events: Array<{ controlId: string; newValue: any }>) => {
      events.forEach(({ controlId, newValue }) => {
        console.log(`Control ${controlId} changed to ${newValue}`);
        
      });
    });
  }
  
  /** Function handling drag and drop functionality for a component */
  drop(event: CdkDragDrop<FlowControl[]>) {
    const draggedData = event.item.data;

    if (draggedData) {
      // Assign a unique ID using UUID
      draggedData.id = ___guid(); 
      draggedData.dropped = true;
      
      // Handle array item transfers
        // if (event.previousContainer === event.container) {
          // this.droppedElements.subscribe((_val) => {
          //   moveItemInArray(_val, event.previousIndex, event.currentIndex)
          //   console.log(_val, event.previousIndex, event.currentIndex, 'move items')
          // })
          
        // }else {
        //   transferArrayItem(
        //     event.previousContainer.data,
        //     event.container.data,
        //     event.previousIndex,
        //     event.currentIndex,
        //   );
        // }

        this.cdr.detectChanges();
        this.flowStateProvider.setControls(draggedData); // Update the state provider
    }
  }

  /** Opening an editable field when user clicks on a dropped element */
  createField(element: FlowControl) {
    if (element.dropped) {
      const componentRef = this.editorComponentFactory.createEditorComponent(element, this.vcr);

      console.log('Component Created:', componentRef.componentType);

      componentRef.instance.control = element

      componentRef.instance.type = element.type;  // Pass the value to the component

      componentRef.changeDetectorRef.detectChanges();
    }
  }   

  ngOnDestroy(): void {
    this._sbS.unsubscribe()
   }
}

