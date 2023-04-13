import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  private _coordinate = new Subject<object>();
  coord$ = this._coordinate.asObservable();

  set coordinates(coord: object) {
    this._coordinate.next(coord);
  }
}
