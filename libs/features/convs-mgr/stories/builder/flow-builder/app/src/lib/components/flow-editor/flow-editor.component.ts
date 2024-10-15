import { v4 as ___guid } from 'uuid';
import { AfterViewInit, Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui';

import { SubSink } from 'subsink';
import { Observable, of, take } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlowService } from '@app/state/convs-mgr/wflows';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl } from '@app/model/convs-mgr/stories/flows';

import { EditorComponentFactory } from '../../services/editor-component-factory.service';
import { _GetFlowComponentForm } from '../../providers/flow-forms-build-factory.util';
import { _JsPlumbInputOptionDecorator } from '@app/features/convs-mgr/stories/builder/blocks/library/block-options';
import { connectDivsWithJsPlumb } from '@app/features/convs-mgr/stories/builder/editor-state';


@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.scss']
})
export class FlowEditorComponent implements OnInit, OnDestroy, AfterViewInit 
{
  private _sbS = new SubSink();
  droppedElements$: Observable<FlowControl[]>;
  jsPlumb: BrowserJsPlumbInstance;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;
  state: FlowBuilderStateFrame;
  
  @ViewChild('phone_container') phoneContainer: ElementRef;
  @ViewChild('config_container') configContainer: ElementRef;
  @ViewChild('motherDiv') motherDiv: ElementRef;

  constructor( private _flowBuilderState: FlowBuilderStateProvider,
               private editorComponentFactory: EditorComponentFactory,
               private _fb: FormBuilder,
               private trackerService: ChangeTrackerService,
               private _wFlowService: WFlowService,
               private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.droppedElements$ = this._flowBuilderState.getControls();

    this.droppedElements$.pipe(take(1)).subscribe((elements)=> {
      elements.forEach(item => this.createField(item));
    })

    this._sbS.sink = this.trackerService.change$.subscribe();
  }

  // ngAfterViewInit(): void {
  //   const phoneContainer1 = this.phoneContainer.nativeElement;
  //   console.log("", phoneContainer1);
  //   // console.log("jsPlumb", this.jsPlumb);
  //   if (this.jsPlumb) {
  //     this._decorateInput();
  //   }
  // }

  ngAfterViewInit() {
    setTimeout(() => {
      this.jsPlumb = newInstance({
        container: this.motherDiv.nativeElement
      });
  
      this._decorateInput();
      this.jsPlumb.repaintEverything();  
    }, 100);  
  }
  

  private _decorateInput() {
    const phoneContainer = this.phoneContainer.nativeElement;

    const configContainer = this.configContainer.nativeElement;

    this.jsPlumb
    connectDivsWithJsPlumb(phoneContainer, configContainer, this.jsPlumb);
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

