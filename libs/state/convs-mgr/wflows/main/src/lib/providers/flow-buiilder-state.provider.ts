import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { ChangeTrackerService } from "../services/track-changes.service";

import { FlowJsonBuilderService } from "../services/build-flow-json.service";
import { FLOW_CONTROLS, FlowControl } from "@app/features/convs-mgr/stories/builder/flow-builder/app";

/**
 * Manages the state of flow controls.
 */
@Injectable({ providedIn: 'root' })
export class FlowBuilderStateProvider {
  /** Initial list of control state for the editor */
  private _controls = FLOW_CONTROLS();
  
  /** BehaviorSubject to track changes in control state */
  private _controls$$ = new BehaviorSubject<FlowControl[]>([]);

  constructor(
    private changeTrackerService: ChangeTrackerService,
    private flowJsonBuilderService: FlowJsonBuilderService
  ) {
    this.initializeAutoSave();
  }

  /**
   * Gets the current list of controls.
   */
  getControls(): FlowControl[] {
    return [...this._controls]; // Return a copy to avoid external mutation
  }

  /**
   * Updates the list of controls and notifies subscribers.
   * @param controls - The new list of controls.
   */
  setControls(controls: FlowControl[]) {
    this._controls = [...controls];
    this._controls$$.next(this._controls);
  }

  /**
   * Gets the BehaviorSubject for controls.
   */
  getControls$$(): BehaviorSubject<FlowControl[]> {
    return this._controls$$;
  }

  /**
   * Updates a specific control component.
   * @param comp - The control component to update.
   */
  updateComponent(comp: FlowControl) {
    const updatedControls = this._controls.filter(c => c.id !== comp.id);
    updatedControls.push(comp);
    this.setControls(updatedControls);
  }

  private initializeAutoSave(): void {
    this.changeTrackerService.change$.subscribe((changes) => {
      if (changes.length > 0) {
        // Update controls based on the change
        changes.forEach(change => {
          const control = this._controls.find(c => c.id === change.controlId);
          if (control) {
            control.value = change.newValue;
            this.updateComponent(control);
          }
        });

        // Pass FlowControl[] to FlowJsonBuilderService for mapping
        this.flowJsonBuilderService.buildJson(this.getControls());    
      }
      this.saveJson()
    });
  }

  saveJson () {
    // Save the generated JSON
    this.flowJsonBuilderService.getMetaJson$().subscribe( (savedJson) => {
      console.log("Updated JSON:", savedJson);
    })
  }
}

