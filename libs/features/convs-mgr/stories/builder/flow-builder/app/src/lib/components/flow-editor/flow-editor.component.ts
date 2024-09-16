import { v4 as ___guid } from 'uuid';
import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { combineLatest, Observable, of } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider, FlowBuilderStateService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlowService } from '@app/state/convs-mgr/wflows';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

import { FlowControl } from '../../providers/flow-controls.const';
import { EditorComponentFactory } from '../../services/editor-component-factory.service';
import { _GetFlowComponentForm } from '../../providers/flow-forms-build-factory.util';
import { _MapToFlowControl } from '../../utils/map-to-flow-element.util';


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
  flowBuilderState$$: FlowBuilderStateProvider;
  state$$: Observable<FlowBuilderStateFrame>;

  constructor( private _flowBuilderState: FlowBuilderStateService,
               private editorComponentFactory: EditorComponentFactory,
               private _fb: FormBuilder,
               private trackerService: ChangeTrackerService,
               private _wFlowService: WFlowService,
               private cdr: ChangeDetectorRef,
  ) { 
    this.flowBuilderState$$ = this._flowBuilderState.get();
    this.droppedElements = this.flowBuilderState$$.getControls();
  }

  ngOnInit(): void {
   this._sbS.sink = this.trackerService.change$.subscribe();
   this.state$$  = this.flowBuilderState$$.get();

   this.initEditor();
  }

  async initEditor() {

   const activeScreen$ = this.flowBuilderState$$.activeScreen$;
  //  const activeScreen$ = of(0);

    this._sbS.sink = combineLatest([this.state$$, activeScreen$]).subscribe(([state, screen])=> {
        const allElementsData = state.flow.flow.screens[screen].layout.children;

        if(allElementsData && allElementsData.length > 0) {
          
          for(const elem of allElementsData) {
            // Map elem to flow control
            const flowControlElem = _MapToFlowControl(elem) as FlowControl;
            // Build form
            const elementForm  = _GetFlowComponentForm(this._fb, elem);
            // use the flow control to load the component
            this.createField(flowControlElem, elementForm);
          }
        }
    })
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
        this.flowBuilderState$$.setControls(draggedData); // Update the state provider
    }
  }

  /** Opening an editable field when user clicks on a dropped element */
  createField(element: FlowControl, form?: FormGroup) {
    if (element.dropped) {

      const componentRef = this.editorComponentFactory.createEditorComponent(element, this.vcr);
          
      componentRef.instance.control = element;

      componentRef.instance.elementForm = form;

      if(!form) {
        const elementForm  = _GetFlowComponentForm(this._fb);
        componentRef.instance.elementForm = elementForm;
      }

      componentRef.instance.type = element.type;  // Pass the value to the component

      componentRef.changeDetectorRef.detectChanges();
    }
  }   

  ngOnDestroy(): void {
    this._sbS.unsubscribe()
   }
}

