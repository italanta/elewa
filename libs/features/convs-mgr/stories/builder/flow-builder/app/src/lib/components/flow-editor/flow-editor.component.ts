import { v4 as ___guid } from 'uuid';
import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable, of, take } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlowService } from '@app/state/convs-mgr/wflows';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl } from '@app/model/convs-mgr/stories/flows';

import { EditorComponentFactory } from '../../services/editor-component-factory.service';
import { _GetFlowComponentForm } from '../../providers/flow-forms-build-factory.util';
import { SideScreenToggleService } from '@app/features/convs-mgr/stories/builder/editor-state';


@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.scss']
})
export class FlowEditorComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();
  droppedElements$: Observable<FlowControl[]>;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;
  state: FlowBuilderStateFrame;
  droppedItems: any;
  isEditing = false;
  isSideScreenOpen: boolean;

  constructor( private _flowBuilderState: FlowBuilderStateProvider,
               private editorComponentFactory: EditorComponentFactory,
               private _fb: FormBuilder,
               private trackerService: ChangeTrackerService,
               private _wFlowService: WFlowService,
               private cdr: ChangeDetectorRef,
               private sideScreen: SideScreenToggleService
  ) { }
  
  ngOnInit(): void {
    this._sbS.sink = this.sideScreen.sideScreen$.subscribe((isOpen) => {
      this.isSideScreenOpen = isOpen;
    })
    this.droppedElements$ = this._flowBuilderState.getControls();

    this.droppedElements$.pipe(take(1)).subscribe((elements)=> {
      this.droppedItems = elements;
      elements.forEach(item => this.createField(item));
    })

    this._sbS.sink = this.trackerService.change$.subscribe();
  }

  editButton() {
    this.isEditing = true;
  }

  toggleSidenav(){
    this.sideScreen.toggleSideScreen(!this.isSideScreenOpen);
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
        this._flowBuilderState.setControls(draggedData); // Update the state provider
    }
  }

  /** Opening an editable field when user clicks on a dropped element */
  createField(element: FlowControl) {

    if (element.dropped) {

      const componentRef = this.editorComponentFactory.createEditorComponent(element, this.vcr);
          
      componentRef.instance.control = element;

      const elementForm  = _GetFlowComponentForm(this._fb, element);
      componentRef.instance.elementForm = elementForm;

      componentRef.instance.type = element.controlType;  // Pass the value to the component

      componentRef.changeDetectorRef.detectChanges();
    }
  }   

  ngOnDestroy(): void {
    this._sbS.unsubscribe()
   }
}

