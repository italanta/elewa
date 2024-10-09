import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

@Component({
  selector: 'app-flow-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class FlowPageSelectorComponent
{
  screens = [{title: "SCREEN 1"}];
  state$: Observable<FlowBuilderStateFrame>;

  constructor(private _flowBuilderState: FlowBuilderStateProvider) 
  { }

  changeScreen(i: number) {
    this._flowBuilderState.changeScreen(i);
  }
  addScreen() {
    this._flowBuilderState.addScreen();
  }
}
