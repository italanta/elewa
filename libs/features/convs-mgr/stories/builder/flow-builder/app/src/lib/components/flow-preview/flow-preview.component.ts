import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-flow-preview',
  templateUrl: './flow-preview.component.html',
  styleUrls: ['./flow-preview.component.scss']
})
export class FlowPreviewComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  constructor() 
  { }

  ngOnInit(): void { }


  ngOnDestroy(): void {
      
  }
}
