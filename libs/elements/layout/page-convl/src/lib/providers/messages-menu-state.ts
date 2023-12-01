import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuStateToggleService {
  private _showChildren = new BehaviorSubject(false);
  menuState$ = this._showChildren.asObservable();

  toggleMenuState(value: boolean) {
    this._showChildren.next(value);
  }
}
