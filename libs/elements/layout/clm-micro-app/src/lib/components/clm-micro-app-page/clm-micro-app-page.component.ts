import { Component, OnInit } from '@angular/core';
import {  MicroAppStore } from '@app/state/convs-mgr/micro-app';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-clm-micro-app-page',
  templateUrl: './clm-micro-app-page.component.html',
  styleUrls: ['./clm-micro-app-page.component.scss'],
})
export class ClmMicroAppPageComponent implements OnInit
{
  logoUrl = ''

  constructor (private _microApp$$: MicroAppStore){}

  ngOnInit()
  {
    // Add method to get microapp logo
    const app$ = this._microApp$$.get()
  }
}
