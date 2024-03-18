import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuStateToggleService {
  private initVal = {
    messaging: true,
    manageUsers: true,
  }

  private _showChildren = new BehaviorSubject(this.initVal);
  menuState$ = this._showChildren.asObservable();

  toggleMenuState(value: {messaging: boolean, manageUsers: boolean}) {
    this._showChildren.next(value);
  }
}
