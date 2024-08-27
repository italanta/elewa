import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService {
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any }[]>([]);
  public change$ = this.changeSubject.asObservable().pipe(
    debounceTime(5000), // 5 second debounce time for autosave
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Prevent redundant saves
  );

  constructor() {}

  updateValue(controlId: string, newValue: any): void {
    this.changeSubject.next([{ controlId, newValue }]);
  }

  clearChanges(): void {
    this.changeSubject.next([]);
  }
}
