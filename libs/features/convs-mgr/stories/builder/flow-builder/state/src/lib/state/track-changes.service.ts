import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
// import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlow, FlowJSONV31, FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';
import { WFlowService } from '@app/state/convs-mgr/wflows';
import { FlowBuilderStateProvider } from './flow-builder-state.provider';
// import { WFlowService } from '../providers/wflow.service';


@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService {
  private jsonArray: { controlId: string; newValue: any }[] = []; // Tracks changes
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any }[]>([]);

  constructor(private _wFlowService: WFlowService, private _flowBuilderState: FlowBuilderStateProvider) {}

  public change$ = this.changeSubject.asObservable();

  /**
   * Update value and trigger save
   */
  updateValue(controlId: string, newValue: any) {
    this.jsonArray.push({ controlId, newValue });
    this.changeSubject.next(this.jsonArray);
    // Step 1: Build WFlow object and post to wFlowStore
    const wflow: WFlow = {
      // TODO: @Beulah-Matt - Save elements per screen
      flow: this.buildFlowJSON(), 
      name: `Flow_${Date.now()}`,
      validation_errors: [],  
      timestamp: new Date().getTime()
    };
    console.log(wflow)
    return this._flowBuilderState.get().pipe(switchMap((state)=> {
      const config = state.flow;
      if(config && config.flow.id) {
        wflow.flow.id = config.flow.id;
        return this._wFlowService.add(wflow); 
      } else {
        return this._wFlowService.initFlow(wflow);
      }
    }))
  }

  /**
   * Build the FlowJSONV31 object
   */
  private buildFlowJSON(): FlowJSONV31 {
    const screens = this.jsonArray.map((change) => {
      return this.createScreen(change.controlId, change.newValue);
    });

    return {
      id: Math.random.toString(),
      version: '3.1',
      screens: screens,  // Screens built from user interactions
      data_api_version: '3.0',
      routing_model: this.buildRoutingModel(screens),  // Define screen routing
    };
  }

  /**
   * Create a single screen from a controlId and its new value
   */
  private createScreen(controlId: string, newValue: any): FlowScreenV31 {
    return {
      id: controlId,  // Unique ID for the screen
      layout: {
        type: 'SingleColumnLayout',
        children: [newValue],  // The form element for the screen
      },
      title: `Screen for ${controlId}`,
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
