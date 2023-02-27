import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidemenuToggleService {
  private _expand = new BehaviorSubject(true);
  menuStatus$ = this._expand.asObservable();

  toggleExpand(value: boolean) {
    this._expand.next(value);
  }
}
