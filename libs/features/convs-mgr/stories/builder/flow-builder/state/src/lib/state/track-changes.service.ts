import { v4 as guid } from 'uuid';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
// import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlow, FlowJSONV31, FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';
import { WFlowService } from '@app/state/convs-mgr/wflows';

import { FlowBuilderStateProvider } from './flow-builder-state.provider';
import { FlowBuilderStateService } from '../services/flow-builder-state-service';
// import { WFlowService } from '../providers/wflow.service';


@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService {
  private jsonArray: { controlId: string; newValue: any, screenId: number}[] = []; // Tracks changes
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any, screenId?: number }[]>([]);
  private flowBuilderState$$: FlowBuilderStateProvider;

  constructor(private _wFlowService: WFlowService, private _flowBuilderState: FlowBuilderStateService) {
    this.flowBuilderState$$ = _flowBuilderState.get();
  }

  public change$ = this.changeSubject.asObservable();

  /**
   * Update value and trigger save
   */
  updateValue(controlId: string, newValue: any) {
      const activeScreenIndex = 0;
      // const activeScreenIndex = this._flowBuilderState.activeScreen$.getValue();
      this.jsonArray.push({ controlId, newValue, screenId: activeScreenIndex });
      this.changeSubject.next(this.jsonArray);
    
      // Build and post the updated flow with all screens and controls
      const wflow: WFlow = {
        flow: this.buildFlowJSON(),
        name: `Flow_${Date.now()}`,
        validation_errors: [],
        timestamp: new Date().getTime(),
        id: guid()
      };

      return this.flowBuilderState$$.get().pipe(switchMap((state) => {
        const config = state.flow;
        if (config && config.flow.id) {
          wflow.flow.id = config.flow.id;
          return this._wFlowService.initFlow(wflow);
        } else {
          return this._wFlowService.add(wflow);
        }
      }));
    }
  

  /**
   * Build the FlowJSONV31 object
   */
  private buildFlowJSON(): FlowJSONV31 {
    // Group controls by screen
    const screenMap: { [screenId: string]: any[] } = {};
    this.jsonArray.forEach(change => {
      if (!screenMap[change.screenId]) {
        screenMap[change.screenId] = [];
      }
      screenMap[change.screenId].push(change.newValue);
    });
  
    // Create screens with grouped controls
    const screens = Object.keys(screenMap).map(screenId => {
      return this.createScreen(screenId, screenMap[screenId]);
    });
  
    return {
      id: guid(),
      version: '3.1',
      screens: screens,
      data_api_version: '3.0',
      routing_model: this.buildRoutingModel(screens),
    };
  }
  

  /**
   * Create a single screen from a controlId and its new value
   */
  private createScreen(screenId: string, controls: any[]): FlowScreenV31 {
    return {
      id: screenId,
      layout: {
        type: 'SingleColumnLayout',
        children: controls,  // Grouped controls for this screen
      },
      title: `SCREEN ${screenId +1}`,
    };
  }
  
  /**
   * Build routing model for screen navigation
   */
  private buildRoutingModel(screens: FlowScreenV31[]): { [screen_name: string]: string[] } {
    const routing: { [screen_name: string]: string[] } = {};
    screens.forEach((screen, index) => {
      if (index < screens.length - 1) {
        routing[screen.id] = [screens[index + 1].id];  // Link to next screen
      }
    });
    return routing;
  }

  /**
   * Clear all changes
   */
  clearChanges(): void {
    this.changeSubject.next([]);
    this.jsonArray = [];
  }
}
