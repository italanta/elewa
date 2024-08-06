import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FLOW_CONTROLS, FlowControl } from '../../providers/flow-controls.const';

@Component({
  selector: 'app-flow-library',
  templateUrl: './flow-library.component.html',
  styleUrls: ['./flow-library.component.scss']
})
export class FlowLibraryComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  controls: FlowControl[]


  constructor() 
  { }

  ngOnInit(): void {
    this.controls = FLOW_CONTROLS();
    console.log(this.controls)
   }


  ngOnDestroy(): void {
      
  }
}
