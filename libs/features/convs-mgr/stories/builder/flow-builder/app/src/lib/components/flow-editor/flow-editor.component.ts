import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.scss']
})
export class FlowEditorComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  constructor() 
  { }

  ngOnInit(): void { }


  ngOnDestroy(): void {
      
  }
}
