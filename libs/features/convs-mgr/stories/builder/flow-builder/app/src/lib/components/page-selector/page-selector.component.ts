import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-flow-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class FlowPageSelectorComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  constructor() 
  { }

  ngOnInit(): void { }


  ngOnDestroy(): void {
      
  }
}
