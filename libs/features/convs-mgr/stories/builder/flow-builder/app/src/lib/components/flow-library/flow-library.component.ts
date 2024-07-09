import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-flow-library',
  templateUrl: './flow-library.component.html',
  styleUrls: ['./flow-library.component.scss']
})
export class FlowLibraryComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  constructor() 
  { }

  ngOnInit(): void { }


  ngOnDestroy(): void {
      
  }
}
