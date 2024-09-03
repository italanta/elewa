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

  private jsonArray: { controlId: string; newValue: any }[] = []

  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any }[]>([]);

  constructor(private _wFlowStore: FlowsStore) {}

  public change$ = this.changeSubject.asObservable().pipe(
    debounceTime(1000), 
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Prevent redundant saves
  );

  setJsonArray(jsonArray: { controlId: string; newValue: any }[]) {
    this.jsonArray = jsonArray;
  }

  updateValue(controlId: string, newValue: any): void {
   this.jsonArray.push({ controlId, newValue })
   this.changeSubject.next(this.jsonArray);
   console.log(this.changeSubject.getValue())

  }

  clearChanges(): void {
    this.changeSubject.next([]);
  }
}
