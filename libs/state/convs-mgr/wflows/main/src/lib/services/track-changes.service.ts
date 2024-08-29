import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FlowsStore } from '../stores/wflow.store';

@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService {
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any }[]>([]);
  public change$ = this.changeSubject.asObservable().pipe(
    debounceTime(1000), 
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Prevent redundant saves
  );

  constructor(private _wFlowStore: FlowsStore) {}

  updateValue(controlId: string, newValue: any): void {
    console.log(controlId);
    this.changeSubject.next([{ controlId, newValue }]);
    // this.
  }

  clearChanges(): void {
    this.changeSubject.next([]);
  }
}
