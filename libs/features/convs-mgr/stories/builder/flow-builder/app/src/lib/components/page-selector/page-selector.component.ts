import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider, FlowBuilderStateService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';

@Component({
  selector: 'app-flow-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class FlowPageSelectorComponent
{
  screens: FlowScreenV31[];
  private flowBuilderState$$: FlowBuilderStateProvider;
  state$: Observable<FlowBuilderStateFrame>;

  constructor(private _flowBuilderState: FlowBuilderStateService) 
  { 
    this.flowBuilderState$$ = this._flowBuilderState.get();
    this.state$ = this.flowBuilderState$$.get();
  }

  changeScreen(i: number) {
    this.flowBuilderState$$.activeScreen$.next(i);
  }
  addScreen() {
    this.flowBuilderState$$.addScreen();
  }
}
