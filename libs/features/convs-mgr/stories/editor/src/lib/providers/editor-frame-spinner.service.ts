import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorFrameLoadingService {
  private _loading = new BehaviorSubject(true);
  loaded$ = this._loading.asObservable();

  changeLoadingState(value: boolean) {
    this._loading.next(value);
  }
}
