import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Service tracking user interactions
 */
export class ChangeTrackerService {
  private changeSubject = new BehaviorSubject<{ controlId: string; newValue: any }[]>([]);
  public change$ = this.changeSubject.asObservable();

  constructor() {}

  updateValue(controlId: string, newValue: any): void {
    this.changeSubject.next([{ controlId, newValue }]);
  }

  clearChanges(): void {
    this.changeSubject.next([]);
  }
}
