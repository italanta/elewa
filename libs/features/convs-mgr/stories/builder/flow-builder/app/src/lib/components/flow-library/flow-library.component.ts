import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FLOW_CONTROL_GROUPS } from '../../providers/flow-controls.const';

@Component({
  selector: 'app-flow-library',
  templateUrl: './flow-library.component.html',
  styleUrls: ['./flow-library.component.scss']
})
export class FlowLibraryComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  controls = FLOW_CONTROL_GROUPS;

  constructor() 
  { }

  ngOnInit(): void { }


  ngOnDestroy(): void {
      
  }
}
