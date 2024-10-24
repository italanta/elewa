import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlowControl, FLOW_CONTROLS } from '@app/model/convs-mgr/stories/flows';
// import { FlowEditorStateProvider } from '@app/state/convs-mgr/wflows';

@Component({
  selector: 'app-flow-library',
  templateUrl: './flow-library.component.html',
  styleUrls: ['./flow-library.component.scss']
})
export class FlowLibraryComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  controls: FlowControl[]  = FLOW_CONTROLS();


  // constructor(private flowStateProvider: FlowEditorStateProvider) 
  // { }

  ngOnInit(): void {
    // GROUP_FLOW_CONTROL_GROUPS(this.controls)
    // console.log(this.controls)
   }

  ngOnDestroy(): void {
      
  }
}
