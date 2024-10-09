import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, take } from 'rxjs';

import { WFlow, FlowPageLayoutElementV31 } from '@app/model/convs-mgr/stories/flows';
import { WFlowService } from '@app/state/convs-mgr/wflows';

import { FlowBuilderStateProvider } from './flow-builder-state.provider';
import { getUUID } from '../utils/get-uuid.util';
import { FlowBuilderStateFrame } from '../model/flow-builder-state-frame.interface';
import { buildFlowJSON } from '../utils/build-json.util';


@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService
{
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any, screenId?: number; }[]>([]);

  constructor(private _wFlowService: WFlowService, private _flowBuilderState: FlowBuilderStateProvider)
  { }

  public change$ = this.changeSubject.asObservable();

  /**
   * Update value and trigger save
   */
  updateValue(newValue: FlowPageLayoutElementV31)
  {
    // Build and post the updated flow with all screens and controls

    return this._flowBuilderState.get().pipe(take(1), switchMap((state) =>
    {
      const wflow = this._generateFlow(state, newValue);

      const config = state.flow;
      if (config && config.flow.id) {

        return this._wFlowService.add(wflow);
      } else {
        wflow.flow.id = config.flow.id;
        return this._wFlowService.initFlow(wflow);
      }
    }));
  }


  private _generateFlow(state: FlowBuilderStateFrame, update: FlowPageLayoutElementV31, screen?: number)
  {
    const wflow: WFlow = {
      flow: buildFlowJSON(state, update, screen),
      name: `Flow_${Date.now()}`,
      validation_errors: [],
      timestamp: new Date().getTime(),
      id: getUUID()
    };

    return wflow;
  }

  /**
   * Clear all changes
   */
  clearChanges(): void
  {
    this.changeSubject.next([]);
  }
}
