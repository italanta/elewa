import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LibraryMenuToggleService {
  private _expand = new BehaviorSubject(true);
  libraryStatus$ = this._expand.asObservable();

  toggleLibraryExpand(value: boolean) {
    this._expand.next(value);
  }
}
