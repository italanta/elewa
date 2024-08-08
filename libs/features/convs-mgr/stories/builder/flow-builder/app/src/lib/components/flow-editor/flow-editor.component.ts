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

  // drop(event: CdkDragDrop<any>): void {
  //   debugger
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //   }
  //   console.log(this.flowEls);
  // }
 
  //TESTING DROP WITH SERVICE
  drop(event: CdkDragDrop<FlowControl[]>) {
    console.log('gotten drag data')
    const draggedData = this.flowStateProvider.getDragData();
    if (draggedData) {
      this.flowEls.push(draggedData);
      this.flowStateProvider.clearDragData();
    }
  }

  ngOnDestroy(): void { }
}

