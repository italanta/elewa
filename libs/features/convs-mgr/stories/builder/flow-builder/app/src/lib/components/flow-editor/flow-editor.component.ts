import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FlowControl } from '../../providers/flow-controls.const';
import { SubSink } from 'subsink';
import { FlowBuilderStateProvider } from '../../providers/flow-dragdrop-helper.provider';

@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.scss']
})
export class FlowEditorComponent implements OnInit, OnDestroy {
  private _sbS = new SubSink();
  flowEls: FlowControl[] = [];

  constructor( private flowStateProvider: FlowBuilderStateProvider) { }

  ngOnInit(): void { }

  drop(event: CdkDragDrop<FlowControl[]>) {
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
  

  ngOnDestroy(): void { }
}

