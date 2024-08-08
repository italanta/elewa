import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FLOW_CONTROLS, FlowControl, GROUP_FLOW_CONTROL_GROUPS } from '../../providers/flow-controls.const';
import { FlowBuilderStateProvider } from '../../providers/flow-dragdrop-helper.provider';
import { CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-flow-library',
  templateUrl: './flow-library.component.html',
  styleUrls: ['./flow-library.component.scss']
})
export class FlowLibraryComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  controls: FlowControl[]  = FLOW_CONTROLS();


  constructor(private flowStateProvider: FlowBuilderStateProvider) 
  { }

  ngOnInit(): void {
    // GROUP_FLOW_CONTROL_GROUPS(this.controls)
    // console.log(this.controls)
   }

   onDragStart(event: CdkDragStart, control: FlowControl) {
    console.log('drag started')
    this.flowStateProvider.setDragData(control);
  }

  ngOnDestroy(): void {
      
  }
}
