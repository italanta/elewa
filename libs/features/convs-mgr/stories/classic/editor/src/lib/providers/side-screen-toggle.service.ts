import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideScreenToggleService {
  private _expand = new BehaviorSubject(true);
  sideScreen$ = this._expand.asObservable();

  toggleSideScreen(value: boolean) {
    this._expand.next(value);
  }
}
