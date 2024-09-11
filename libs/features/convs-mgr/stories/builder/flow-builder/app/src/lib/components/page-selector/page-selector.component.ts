import { Component } from '@angular/core';
import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flow-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class FlowPageSelectorComponent
{
  screens: FlowScreenV31[];
  state$: Observable<FlowBuilderStateFrame>

  constructor(private _flowBuilderState: FlowBuilderStateProvider) 
  { 
    this.state$ = this._flowBuilderState.get();
  }

  changeScreen(i: number) {
    this._flowBuilderState.activeScreen$.next(i);
  }
  addScreen() {
    this._flowBuilderState.addScreen();
  }
}
