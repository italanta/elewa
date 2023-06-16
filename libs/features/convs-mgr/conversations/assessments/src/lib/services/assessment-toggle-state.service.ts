import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessToggleStateService {
  private _btnState = new BehaviorSubject(false);

  publishBtnState = this._btnState.asObservable();

  showPublish() {
    this._btnState.next(false);
  }

  hidePublish() {
    this._btnState.next(true);
  }
}
