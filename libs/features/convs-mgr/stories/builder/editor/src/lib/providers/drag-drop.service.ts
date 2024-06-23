import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Coordinate } from '@app/model/convs-mgr/stories/blocks/main';

@Injectable({
  providedIn: 'root',
})
export class DragDropService 
{
  private _coordinate = new Subject<Coordinate>();
  coord$ = this._coordinate.asObservable();

  set coordinates(coord: Coordinate) {
    this._coordinate.next(coord);
  }
}
