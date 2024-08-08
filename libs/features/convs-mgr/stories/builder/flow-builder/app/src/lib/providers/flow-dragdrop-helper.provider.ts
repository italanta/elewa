import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FLOW_CONTROLS, FlowControl } from "./flow-controls.const";

/**
 * Unpacks flow state into the builder state.
 */
@Injectable()
export class FlowBuilderStateProvider
{
  /** List of control state for the editor */
  controls = FLOW_CONTROLS();
  /** List of control state for the editor */
  controls$$ = new BehaviorSubject<FlowControl[]>(this.controls);
  /** Drag and drop transfer data */
  private dragData$$ = new BehaviorSubject<FlowControl | null>(null);

  dragData$ = this.dragData$$.asObservable();

  // constructor(private _flow$$: any)
  // {

  // }

  setDragData(data: FlowControl) {
    this.dragData$$.next(data);
  }

  clearDragData() {
    this.dragData$$.next(null);
  }

  getDragData() {
    return this.dragData$$.getValue();
  }
}